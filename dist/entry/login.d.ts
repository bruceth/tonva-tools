import * as React from 'react';
import { SubmitReturn } from '../ui';
export default class Login extends React.Component<{
    withBack?: boolean;
}> {
    private schema;
    onLoginSubmit(values: any): Promise<SubmitReturn | undefined>;
    click(): void;
    render(): JSX.Element;
}
