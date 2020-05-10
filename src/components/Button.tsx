import React, { DetailedHTMLProps } from 'react';

export const Button = (props: DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => {
    const baseStyle = 'p-2 bg-blue-400 text-white';
    const className = props.className ? `${baseStyle} ${props.className}` : baseStyle;
    // TODO: Doesn't seem to work, className var is correct, yet only className from props is rendered
    return <button type="button" className={className} {...props} />;
};
