from crewai import Agent, Crew, Task, LLM
from crewai.project import CrewBase, agent, task
from app.core.config import settings
from app.services.tools.serper_tools import SerperTool
from app.services.tools.firecrawl_tools import FirecrawlTool
import os

# Direktori config: app/config/ (sxatu level di atas app/services/)
_CONFIG_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "config")

# Tools (instance BaseTool agar kompatibel dengan CrewAI Agent)
serper_tool = SerperTool()
firecrawl_tool = FirecrawlTool()

from google.genai import types

GEMINI_SAFETY_SETTINGS = [
    types.SafetySetting(
        category=types.HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold=types.HarmBlockThreshold.BLOCK_NONE,
    ),
    types.SafetySetting(
        category=types.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold=types.HarmBlockThreshold.BLOCK_NONE,
    ),
    types.SafetySetting(
        category=types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold=types.HarmBlockThreshold.BLOCK_NONE,
    ),
    types.SafetySetting(
        category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold=types.HarmBlockThreshold.BLOCK_NONE,
    ),
]

flash_llm = LLM(
  model="gemini-2.5-flash",
  api_key=settings.GEMINI_API_KEY,
  temperature=0.5,
  provider="gemini",
  # safety_settings=GEMINI_SAFETY_SETTINGS,
)

pro_llm = LLM(
  model="gemini-2.5-flash",
  api_key=settings.GEMINI_API_KEY,
  temperature=0.2,
  provider="gemini",
  # safety_settings=GEMINI_SAFETY_SETTINGS,
)

# Templates Kustom untuk mematikan instruksi bawaan crewAI
CUSTOM_SYSTEM_TEMPLATE = """
You are {role}.
{backstory}

Your Goal: {goal}
"""

CUSTOM_PROMPT_TEMPLATE = """
Context:
{context}

Task:
{input}

Note: Respond only with the required format.
"""

@CrewBase
class FactCheckerCrew:
  """Fact Checker Crew"""
  
  # Role & Task Prompt Configuration (path absolut agar load_yaml dari CrewBase menemukan file)
  agents_config = os.path.join(_CONFIG_DIR, "agents_cot.yaml")
  tasks_config = os.path.join(_CONFIG_DIR, "tasks.yaml")
  validator_agent_config = os.path.join(_CONFIG_DIR, "agents_validator.yaml")
  validator_tasks_config = os.path.join(_CONFIG_DIR, "validator_task.yaml")

  def __init__(self, experiment_type="cot"):
    if experiment_type == "cot":
      self.agents_config = os.path.join(_CONFIG_DIR, "agents_cot.yaml")
    elif experiment_type == "fewshot":
      self.agents_config = os.path.join(_CONFIG_DIR, "agents_fewshot.yaml")
    else:
      self.agents_config = os.path.join(_CONFIG_DIR, "agents_zeroshot.yaml")

    self.tasks_config = os.path.join(_CONFIG_DIR, "tasks.yaml")
        
  def claim_validator_agent(self):
    return Agent(
      config=self.load_yaml(self.validator_agent_config)['claim_validator'],
      llm=flash_llm,
      verbose=True,
      system_template=CUSTOM_SYSTEM_TEMPLATE,
      prompt_template=CUSTOM_PROMPT_TEMPLATE,
      use_system_prompt=True
    )
  
  def validate_input_task(self):
    return Task(
      config=self.load_yaml(self.validator_tasks_config)['validate_input_task'],
      agent=self.claim_validator_agent()
    )
  
  # Agents Config
  
  @agent
  def query_optimizer(self) -> Agent:
    return Agent(
      config=self.agents_config['query_optimizer'],
      tools=[serper_tool],
      llm=flash_llm,
      verbose=True,
      # system_template=CUSTOM_SYSTEM_TEMPLATE,
      # prompt_template=CUSTOM_PROMPT_TEMPLATE,
      use_system_prompt=True
    )
    
  @agent
  def evidence_collector(self) -> Agent:
    return Agent(
      config=self.agents_config['evidence_collector'],
      tools=[firecrawl_tool],
      llm=flash_llm,
      verbose=True,
      # system_template=CUSTOM_SYSTEM_TEMPLATE,
      # prompt_template=CUSTOM_PROMPT_TEMPLATE,
      use_system_prompt=True
    )
    
  @agent
  def verdict_specialist(self) -> Agent:
    return Agent(
      config=self.agents_config['verdict_specialist'],
      llm=pro_llm,
      verbose=True,
      system_template=CUSTOM_SYSTEM_TEMPLATE,
      prompt_template=CUSTOM_PROMPT_TEMPLATE,
      use_system_prompt=True
    )
  
  # Tasks Config
  
  @task
  def generate_query_task(self) -> Task:
    return Task(config=self.tasks_config['generate_query_task'])
  
  @task
  def gather_evidence_task(self) -> Task:
    return Task(config=self.tasks_config['gather_evidence_task'])
  
  @task
  def verdict_determination_task(self) -> Task:
    return Task(config=self.tasks_config['verdict_determination_task'])
  
  # Helper
  def load_yaml(self, path):
    import yaml
    base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    full_path = os.path.join(base_path, path)
    with open(full_path, 'r') as f:
      return yaml.safe_load(f)

  def inspect_prompts(self):
    print("\n\n" + "="*50)
    print("🔍 INSPEKSI PROMPT CREWAI 🔍")
    print("="*50)
    
    try:
        from crewai.utilities.prompts import Prompts
        agents = [self.query_optimizer(), self.evidence_collector(), self.verdict_specialist()]
        tasks = [self.generate_query_task(), self.gather_evidence_task(), self.verdict_determination_task()]
        
        for idx, (agent, task) in enumerate(zip(agents, tasks)):
            print(f"\n🚀 AGEN {idx + 1}: {agent.role}")
            
            prompt_generator = Prompts(
                agent=agent,
                has_tools=len(agent.tools) > 0,
                use_system_prompt=agent.use_system_prompt
            )

            generated_prompt = prompt_generator.task_execution()

            if "system" in generated_prompt:
                print("\n=== SYSTEM PROMPT ===")
                print(generated_prompt["system"])
                print("\n=== USER PROMPT ===")
                print(generated_prompt["user"])
            elif "prompt" in generated_prompt:
                print("\n=== COMPLETE PROMPT ===")
                print(generated_prompt["prompt"])
            else:
                print(generated_prompt)

            print("\n=== TASK CONTEXT ===")
            print(f"Task Description: {task.description}")
            print(f"Expected Output: {task.expected_output}")
            print("-" * 50)
    except Exception as e:
        print(f"⚠️ Gagal menginspeksi prompt: {e}")
        
    print("="*50 + "\n\n")
  
  # Execution
  def run_validation(self, inputs):
    validator_crew = Crew(
      agents=[self.claim_validator_agent()],
      tasks=[self.validate_input_task()],
      verbose=True
    )
    return validator_crew.kickoff(inputs=inputs)
  
  def run_verification(self, inputs):
    self.inspect_prompts() # <--- Memanggil inspeksi dinamis sebelum kickoff
    
    verification_crew = Crew(
      agents=[
        self.query_optimizer(),
        self.evidence_collector(),
        self.verdict_specialist()
      ],
      tasks=[
        self.generate_query_task(),
        self.gather_evidence_task(),
        self.verdict_determination_task()
      ],
      verbose=True,
    )
    return verification_crew.kickoff(inputs=inputs)
  