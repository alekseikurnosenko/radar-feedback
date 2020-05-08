import { UserAnswers } from "../screens/questionnaire/saveUserAnswers";

export const convertAnswers = (answers: UserAnswers | undefined, measurements: string[]) => {
    const userMeasurements = Object.values(answers || {})
        .flatMap(answers => answers)
        .reduce<{ [measurement: string]: number }>((measurements, answer) => ({
            ...measurements,
            [answer.measurement]: answer.value + (measurements[answer.measurement] || 0)
        }), {});

        return measurements.map(m => userMeasurements[m] || 0);
};