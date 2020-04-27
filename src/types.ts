export interface Answer {
    text: string;
    measurement: string;
    value: number;
}

export interface Question {
    text: string;
    answers: Answer[];
}