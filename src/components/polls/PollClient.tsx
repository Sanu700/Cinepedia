"use client";

import { useState, useEffect, useTransition } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Check, LogIn, ThumbsUp } from "lucide-react";
import { useUser } from "@/firebase";
import type { Poll } from "@/lib/types";
import { placeholderImages, getPoll as fetchPoll } from "@/lib/data";
import { submitVote } from "@/lib/actions";

interface PollMovieCardProps {
    movie: Poll['movieA'];
    onVote: () => void;
    disabled: boolean;
    hasVoted: boolean;
    isWinner: boolean;
    percentage: number;
    votes: number;
}

const PollMovieCard = ({ movie, onVote, disabled, hasVoted, isWinner, percentage, votes }: PollMovieCardProps) => {
    const poster = placeholderImages.find(p => p.id === movie.posterId);

    return (
        <div className="relative flex flex-col items-center space-y-4">
            <Card className="w-full max-w-xs overflow-hidden transition-all duration-300">
                <div className="aspect-[2/3] relative">
                    {poster && <Image src={poster.imageUrl} alt={movie.title} fill className="object-cover" data-ai-hint="movie poster" />}
                    {hasVoted && isWinner && (
                        <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary-foreground">Winner!</span>
                        </div>
                    )}
                </div>
            </Card>
            <h3 className="text-xl font-headline text-center h-14">{movie.title}</h3>
            {hasVoted ? (
                <div className="w-full max-w-xs text-center space-y-2">
                    <Progress value={percentage} className="h-3" />
                    <p className="text-lg font-bold">{percentage.toFixed(0)}%</p>
                    <p className="text-sm text-muted-foreground">{votes.toLocaleString()} votes</p>
                </div>
            ) : (
                <Button onClick={onVote} disabled={disabled} className="w-full max-w-xs">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Vote
                </Button>
            )}
        </div>
    );
};


export default function PollClient() {
    const { user } = useUser();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [userVote, setUserVote] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isVoting, startVoteTransition] = useTransition();

    const getPoll = async () => {
        setLoading(true);
        const { poll: newPoll, userVote: vote } = await fetchPoll();
        setPoll(newPoll);
        setUserVote(vote);
        setLoading(false);
    };

    useEffect(() => {
        getPoll();
    }, []);

    const handleVote = (votedForMovieId: string) => {
        if (!poll) return;
        startVoteTransition(async () => {
            await submitVote(poll.id, votedForMovieId);
            // In a real app, we would refetch the poll data to get updated counts.
            // For this mock, we'll simulate the update.
            setUserVote(votedForMovieId === poll.movieA.id ? 'movieA' : 'movieB');
            setPoll(prev => {
                if (!prev) return null;
                const isVoteA = votedForMovieId === prev.movieA.id;
                return {
                    ...prev,
                    votesA: prev.votesA + (isVoteA ? 1 : 0),
                    votesB: prev.votesB + (!isVoteA ? 1 : 0),
                    totalVotes: prev.totalVotes + 1,
                }
            })
        });
    };
    
    if (loading) {
        return <div className="flex justify-center items-center h-96"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!poll) {
        return <div className="text-center">Could not load a poll. Please try again.</div>;
    }

    const hasVoted = userVote !== null;
    const percentageA = poll.totalVotes > 0 ? (poll.votesA / poll.totalVotes) * 100 : 0;
    const percentageB = poll.totalVotes > 0 ? (poll.votesB / poll.totalVotes) * 100 : 0;
    
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-headline font-bold">Movie Face-Off</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Who reigns supreme? Cast your vote!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <PollMovieCard 
                    movie={poll.movieA}
                    onVote={() => handleVote(poll.movieA.id)}
                    disabled={isVoting || !user}
                    hasVoted={hasVoted}
                    isWinner={hasVoted && poll.votesA >= poll.votesB}
                    percentage={percentageA}
                    votes={poll.votesA}
                />
                <PollMovieCard 
                    movie={poll.movieB}
                    onVote={() => handleVote(poll.movieB.id)}
                    disabled={isVoting || !user}
                    hasVoted={hasVoted}
                    isWinner={hasVoted && poll.votesB > poll.votesA}
                    percentage={percentageB}
                    votes={poll.votesB}
                />
            </div>
            
            <div className="text-center">
                {!user && !hasVoted && (
                    <Card className="max-w-md mx-auto">
                        <CardContent className="p-4 flex items-center justify-between">
                            <p className="text-muted-foreground">Log in to cast your vote.</p>
                             <Button asChild>
                                <Link href="/login">
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Log In
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
                
                {user && hasVoted && (
                     <Button onClick={getPoll} disabled={loading} size="lg">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Next Random Poll"}
                     </Button>
                )}
            </div>
        </div>
    );
}
