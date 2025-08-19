import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username } = await req.json();
    console.log(`Fetching LeetCode stats for username: ${username}`);

    // Fetch from LeetCode GraphQL API
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: JSON.stringify({
        query: `
          query getUserProfile($username: String!) {
            allQuestionsCount {
              difficulty
              count
            }
            matchedUser(username: $username) {
              username
              submitStats: submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                  submissions
                }
              }
              profile {
                ranking
                userAvatar
                realName
              }
            }
          }
        `,
        variables: { username }
      })
    });

    if (!response.ok) {
      throw new Error(`LeetCode API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('LeetCode API response:', data);

    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    const user = data.data.matchedUser;
    if (!user) {
      throw new Error('User not found');
    }

    // Parse the submission stats
    const acStats = user.submitStats.acSubmissionNum;
    const easyCount = acStats.find((stat: any) => stat.difficulty === 'Easy')?.count || 0;
    const mediumCount = acStats.find((stat: any) => stat.difficulty === 'Medium')?.count || 0;
    const hardCount = acStats.find((stat: any) => stat.difficulty === 'Hard')?.count || 0;
    const totalSolved = easyCount + mediumCount + hardCount;

    // Calculate ranking percentage if available
    let rankingText = "N/A";
    if (user.profile.ranking) {
      const ranking = user.profile.ranking;
      if (ranking <= 10000) rankingText = "Top 1%";
      else if (ranking <= 50000) rankingText = "Top 5%";
      else if (ranking <= 100000) rankingText = "Top 10%";
      else if (ranking <= 500000) rankingText = "Top 25%";
      else rankingText = `Rank ${ranking.toLocaleString()}`;
    }

    const stats = {
      username: user.username,
      totalSolved,
      ranking: rankingText,
      easy: easyCount,
      medium: mediumCount,
      hard: hardCount,
      profile: {
        realName: user.profile.realName,
        avatar: user.profile.userAvatar,
        ranking: user.profile.ranking
      }
    };

    console.log('Processed stats:', stats);

    return new Response(JSON.stringify(stats), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in leetcode-stats function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        // Return fallback data in case of error
        fallback: {
          totalSolved: 450,
          ranking: "Top 5%",
          easy: 180,
          medium: 220,
          hard: 50
        }
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});