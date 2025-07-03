// src/components/AiSynthesisCard.tsx
import { Bot, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

// Define the shape of the data this card expects
type AiSynthesis = {
  overall_sentiment: string;
  generated_summary: string;
  common_themes_pros: string[];
  common_themes_cons: string[];
};

export default function AiSynthesisCard({ synthesis }: { synthesis: AiSynthesis }) {
  return (
    <Card className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-indigo-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Bot className="h-6 w-6 text-indigo-600" />
          <span>AI-Powered Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Overall Sentiment</h4>
          <p className="text-gray-700">{synthesis.overall_sentiment}</p>
        </div>
        
        {synthesis.common_themes_pros?.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2"><ThumbsUp className="h-4 w-4 text-green-600"/> Common Pros</h4>
            <div className="flex flex-wrap gap-2">
              {synthesis.common_themes_pros.map((pro: string) => (
                <Badge key={pro} className="bg-green-100 text-green-800 hover:bg-green-200">
                  {pro}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {synthesis.common_themes_cons?.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2"><ThumbsDown className="h-4 w-4 text-red-600"/> Common Cons</h4>
            <div className="flex flex-wrap gap-2">
              {synthesis.common_themes_cons.map((con: string) => (
                <Badge key={con} variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
                  {con}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold mb-2">Generated Summary</h4>
          <p className="text-gray-700 italic">&quot;{synthesis.generated_summary}&quot;</p>
        </div>
      </CardContent>
    </Card>
  );
}