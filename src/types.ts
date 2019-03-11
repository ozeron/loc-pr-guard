export type CheckStatus = 'queued' | 'in_progress' | 'completed';
export type CheckConclusion = 'success' | 'failure' | 'neutral' | 'cancelled'|
                          'timed_out' | 'action_required';
