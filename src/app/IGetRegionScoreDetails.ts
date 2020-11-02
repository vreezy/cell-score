export interface IGetRegionScoreDetails {
   result: {
      gameScore: string[];
      regionName: string;
      regionVertices: [number[]];
      scoreHistory: [string[]];
      timeToEndOfBaseCycleMs: number;
      topAgents: ITopAgents[];
   }
}

interface ITopAgents {
   nick: string;
   team: "ENLIGHTENED" | "RESISTANCE"
}
