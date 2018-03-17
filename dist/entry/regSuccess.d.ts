/// <reference types="react" />
import * as React from 'react';
export interface Props {
    user: string;
    pwd: string;
}
export default class RegSuccess extends React.Component<Props, null> {
    failed(): void;
    login(): void;
    render(): JSX.Element;
}
