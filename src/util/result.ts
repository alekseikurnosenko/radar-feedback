export interface Result<T> {
    loading: boolean;
    error?: Error;
    data?: T;
}
