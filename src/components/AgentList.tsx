// AgentList.tsx
import React from 'react';
import { AgentCard, AgentStatus } from './AgentCard';

interface Agent {
  id: number;
  name: string;
  status: AgentStatus;
  currentTask: string;
  tasksCompleted: number;
  uptime: string;
}

interface AgentListProps {
  agents: Agent[];
  onNavigate?: (screen: string, agentId: number) => void;
}

export function AgentList({ agents, onNavigate }: AgentListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <div key={agent.id}>
          <AgentCard
            name={agent.name}
            status={agent.status}
            currentTask={agent.currentTask}
            tasksCompleted={agent.tasksCompleted}
            uptime={agent.uptime}
            onNavigate={(screen) => onNavigate && onNavigate(screen, agent.id)}
          />
        </div>
      ))}
    </div>
  );
}
