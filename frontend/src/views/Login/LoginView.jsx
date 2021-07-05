/**
 * @module LoginView
 *
 * @description
 * View for login
 *
 * @author Hans-Peter Görg
 **/
import React, {useState} from 'react';

import {Form, FormField, TextInput, Box, Button, Grid, Heading, Card, CardFooter, CardBody} from 'grommet';

import {useHistory} from 'react-router-dom';


import ToolbarView from "../Toolbar/ToolbarView";

import {useTranslation} from "react-i18next";
import {loginMember} from "../../action/actionLogin";
import {CODE} from "../../shared/constants/code";
import ErrorView from "../shared/ErrorView";
import {Grommet} from "grommet";

import {extendedTrim, hasContent} from "../../shared/util/generalUtils";
import {setHelpContextId} from "../Help/HelpContext";
import {HELP_CONTEXT_ID} from "../../shared/constants/enums";
import {THEME} from "../../configTheme";


export default function LoginView() {
    const {t} = useTranslation();
    setHelpContextId(HELP_CONTEXT_ID.LOGIN);

    const history = useHistory();

    const [emailHint, setEmailHint] = useState('');
    const [passwordHint, setPasswordHint] = useState('');

    const [showErrorView, setShowErrorView] = useState(false);
    const [errorCode, setErrorCode] = useState(CODE.OK);

    const defaultValue = {
        email: '',
        password: ''
    };
    const [value, setValue] = useState(defaultValue);


    const onReset = (e) => {
        e.preventDefault();
        setEmailHint('');
        setPasswordHint('');
        setValue(defaultValue)
    };

    const onSubmit = async (event) => {
        let {email, password} = event.value;

        email = extendedTrim(email, true);
        if (!hasContent(email)) {
            setEmailHint(t('login.email.address.required'));
            return;
        }
        if (password === '') {
            setPasswordHint(t('login.password.required'));
            return;
        }

        let code = await loginMember(email, password);

        switch (code) {
            case CODE.NO_ENTRY_FOUND:
                setEmailHint(t('login.unknown.user'));
                break;
            case CODE.INVALID_PASSWORD:
                setPasswordHint(t('login.password.wrong'));
                break;
            case CODE.OK:
                setHelpContextId(HELP_CONTEXT_ID.GENERAL);
                history.push('/');
                break;
            default:
                setErrorCode(code);
                setShowErrorView(true);
        }
    };

    return (
        <Grommet theme={THEME}>
            <>
                <ToolbarView></ToolbarView>

                {!showErrorView &&
                <>
                    <Grid align={"stretch"}
                          areas={[                    //column, row
                              {name: 'left', start: [0, 1], end: [0, 1]},
                              {name: 'content', start: [1, 1], end: [1, 1]},
                              {name: 'right', start: [2, 1], end: [2, 1]},
                          ]}
                          columns={['1/3', '1/3', '1/3']}
                          rows={['xxsmall', 'medium']}
                          gap='small'
                    >
                        <Box gridArea='left'/>

                        <Card gridArea="content" alignContent={"center"}
                              border={{size: "small", color: "brand"}}
                              background={"light-1"}
                              round={false}
                            >
                            <Box direction={"row"} alignSelf={"center"}>
                                <Heading level={3} margin="large" color="brand">{t('login.title')}</Heading>
                            </Box>


                            <Form
                                value={value}
                                onChange={nextValue => {
                                    setValue(nextValue);
                                    setEmailHint('');
                                    setPasswordHint('');
                                }
                                }
                                onReset={onReset}
                                onSubmit={onSubmit}
                            >
                                <CardBody margin={{left: "medium", right: "medium"}}>
                                    <FormField name="email" htmlfor="email" error={emailHint}
                                               label={t('login.email.address')}>
                                        <TextInput type="text" id="email" name="email"/>
                                    </FormField>

                                    <FormField name="password" htmlfor="password" error={passwordHint}
                                               label={t('login.password')}>
                                        <TextInput type="password" id="password" name="password"/>
                                    </FormField>
                                </CardBody>
                                <CardFooter pad={"medium"}>
                                    <Button type={"submit"} margin={"small"} primary
                                            label={t('login.button.submit')}/>
                                    <Button type={"reset"} margin={"small"} secondary
                                            label={t('general.reset')}/>
                                </CardFooter>
                            </Form>

                        </Card>

                        <Box gridArea='right'/>
                    </Grid>

                </>
                }

                {showErrorView &&
                <ErrorView errorCode={errorCode}></ErrorView>
                }
            </>
        </Grommet>
    );
}
