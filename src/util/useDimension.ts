
import { useState, useCallback, useLayoutEffect, useRef } from "react";


export const useDimensions = (ref: React.MutableRefObject<any>): DOMRect | undefined => {
    const [dimensions, setDimensions] = useState<DOMRect | undefined>();

    useLayoutEffect(() => {
        if (ref.current) {
            setDimensions(ref.current.getBoundingClientRect());
        }
    }, [ref.current]);

    return dimensions;
};