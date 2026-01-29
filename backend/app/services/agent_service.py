from crewai import Agent, Crew, Task, LLM
from crewai.project import CrewBase, agent, task
from app.core.config import settings
from app.services.tools.serper_tools import SerperTool
from app.service.tools.firecrawl_tools import FirecrawlTool
import os

# Tools
serper_tool = SerperTool()
firecrawl_tool = FirecrawlTool()

# LLM Instalation
flash_llm = LLM(
  model="gemini/gemini-1.5-flash",
  api_key=settings.GEMINI_API_KEY,
  temperatur=0.5 # Tempertatur sedang agar response balance (variatif & akurat)
)

pro_llm = LLM(
  model="gemini/gemini-2.0-flash",
  api_key=settings.GEMINI_API_KEY,
  temperature=0.2 # Temperatur rendah agar response akurat dan konsisten
)

@CrewBase
class FactCheckerCrew:
  """Fact Checker Crew"""
  
  # Role & Task Prompt Configuration
  agents_config = 'config/agents_cot.yaml'
  tasks_config = 'config/tasks.yaml'
  
  validator_agent_config = 'config/agents_validator.yaml'
  validator_tasks_config = 'config/validator_task.yaml'
  
  def __init__(self, experiment_type="cot"):
    if experiment_type == "cot":
            self.agents_config = 'config/agents_cot.yaml'
        elif experiment_type == "fewshot":
            self.agents_config = 'config/agents_fewshot.yaml'
        else:
            self.agents_config = 'config/agents_oneshot.yaml'
            
        self.tasks_config = 'config/tasks.yaml'
        
  def claim_validator_agent(self):
    return Agent(
      config=self.load_yaml(self.validator_agents_config)['claim_validator'],
      llm=flash_llm,
      verbose=True
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
      verbose=true
    )
    
  @agent
  def evidence_collector(self) -> Agent:
    return Agent(
      config=self.agents_config['evidence_collector'],
      tools=[firecrawl_tool],
      llm=flas_llm,
      verbose=true
    )
    
  @agent
  def verdict_specialist(self) -> Agent:
    return Agent(
      config=self.agents_config['verdict_specialist'],
      llm=pro_llm,
      verbose=true
    )
  
  # Tasks Config
  
  @task
  def generate_query_task(self) -> Task:
    return Task(confif=self.tasks_config['generate_query_task'])
  
  @task
  def gather_evidence_task(self) -> Task:
    return Task(confi=self.tasks_config['gather_evidence_task'])
  
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
  
  # Execution
  def run_validation(self, inputs):
    validator_crew = Crew(
      agents=[self.claim_validator_agent()],
      tasks=[self.validator_input_taks()],
      verbose=True
    )
    return validator_crew.kickoff(inputs=inputs)
  
  def run_verification(self, inputs):
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
  