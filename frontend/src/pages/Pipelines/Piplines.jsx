"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";


import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import { TooltipProvider } from "@/components/ui/tooltip";

import { useAuth } from "../../context/AuthContext";

import {
  getStages,
  updateStage,
  deleteStage,
} from "../../api/stages.api";
import { getPipelines } from "../../api/pipelines.api";
import { getLeadsByPipeline } from "../../api/leads.api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Users, DollarSign, Funnel } from "lucide-react";



export default function Pipeline() {
  const navigate = useNavigate();
  const { user } = useAuth();

 
  const [stages, setStages] = React.useState([]);
  const [pipelines, setPipelines] = React.useState([]);
  const [leads, setLeads] = React.useState([]);
  const [selectedPipeline, setSelectedPipeline] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchPipelines();
  }, []);

  React.useEffect(() => {
    if (selectedPipeline) {
      fetchStagesAndLeads(selectedPipeline.id);
    }
  }, [selectedPipeline]);

  const fetchPipelines = async () => {
    try {
      setError(null);
      const res = await getPipelines();
      setPipelines(res?.data || []);
      setSelectedPipeline(res.data[0] || null)
      console.log('fetchedPipline',res.data)
    } catch (err) {
      setError("Failed to load pipelines");
      console.error(err);
    } finally {
   //   setLoading(false);
    }
  };

  const fetchStagesAndLeads = async (pipelineId) => {
    try {
      setError(null);
      const [stagesRes, leadsRes] = await Promise.all([
        getStages(pipelineId),
        getLeadsByPipeline(pipelineId)
      ]);
      setStages(stagesRes?.data || []);
      setLeads(leadsRes?.data.leads || []);
    } catch (err) {
      setError("Failed to load stages and leads");
      console.error(err);
    }
  };

  const getLeadsForStage = (stageId) => {
    const stageLeads = leads.filter(lead => lead.pipeline_stage_id === stageId);
    if (searchTerm) {
      return stageLeads.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.contact_info.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return stageLeads;
  };

  // if (loading) return (
  //   <div className="flex justify-center items-center h-64">
  //     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  //   </div>
  // );

  if (error) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-red-500 text-center">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="p-6 w-full max-w-6xl mx-auto ">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Funnel className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Pipeline View</h1>
              {selectedPipeline && (
                <p className="text-sm text-muted-foreground">{selectedPipeline.name} • {leads.length} leads</p>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {selectedPipeline && (
              <>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
              </>
            )}
            <Select value={selectedPipeline?.id?.toString()} onValueChange={(value) => {
              const pipeline = pipelines.find(p => p.id.toString() === value);
              setSelectedPipeline(pipeline);
            }}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select Pipeline" />
              </SelectTrigger>
              <SelectContent>
                {pipelines.map((pipeline) => (
                  <SelectItem key={pipeline.id} value={pipeline.id.toString()}>
                    {pipeline.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedPipeline && (
          <div className="flex gap-3 overflow-x-auto pt-8">
            {stages.map((stage, index) => {
              const stageLeads = getLeadsForStage(stage.id);
              const colors = ['bg-blue-50 border-blue-200', 'bg-green-50 border-green-200', 'bg-yellow-50 border-yellow-200', 'bg-purple-50 border-purple-200', 'bg-pink-50 border-pink-200'];
              const colorClass = colors[index % colors.length];
              return (
                <div key={stage.id} className="flex-shrink-0 w-80">
                  <Card className={`${colorClass} border-2 h-full`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex justify-between items-center">
                        {stage.name}
                        <Badge variant="secondary" className="bg-white/80">
                          {stageLeads.length}
                        </Badge>
                      </CardTitle>
                     
                    </CardHeader>
                    <CardContent className="min-h-32 space-y-3  ">
                      {stageLeads.map((lead) => (
                        <Card key={lead.id} className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-white/90 backdrop-blur-sm" onClick={() => navigate(`/dashboard/leads/${lead.id}`)}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-sm leading-tight">{lead.name}</h4>
                              <Badge variant={lead.status === 'open' ? 'default' : 'secondary'} className="text-xs">
                                {lead.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{lead.contact_info}</p>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3 text-green-600" />
                                <span className="text-xs font-medium">
                                  {lead.expected_value ? `$${lead.expected_value}` : 'N/A'}
                                </span>
                              </div>
                              {lead.assignedUser && (
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {lead.assignedUser.full_name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {stageLeads.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <p className="text-sm">No leads in this stage</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        )}

        {!selectedPipeline && (
          <div className="text-center py-16">
            <Funnel className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Select a Pipeline</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Choose a pipeline from the dropdown above to view its stages and leads in a Kanban board layout.
            </p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
