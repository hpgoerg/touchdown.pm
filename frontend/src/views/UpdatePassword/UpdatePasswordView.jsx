/**
 * @module UpdatePasswordView
 *
 * @description
 * View dialog to update the password of the logged in member
 *
 * @author Hans-Peter Görg
 **/
import React, {useState} from 'react';
import {
    Form,
    FormField,
    TextInput,
    Box,
    Button,
    Heading,
    Layer,
    Text,
    CardHeader,
    CardBody,
    CardFooter,
    Card
} from 'grommet';
import {useTranslation} from "react-i18next";
import {restPutUpdateMemberPassword} from "../../service/servicePutRest";
import {CODE} from "../../shared/constants/code";
import ErrorView from "../shared/ErrorView";
import {Grommet} from "grommet";
import {getAccount} from "../../model/account";
import {checkPassword} from "../../shared/util/checks";
import {Close} from "grommet-icons";
import {THEME} from "../../configTheme";


export default function UpdatePasswordView({onClose}) {
    const {t} = useTranslation();

    const defaultPasswords = {
        password: '',
        passwordCompare: ''
    };

    const [passwordHint, setPasswordHint] = useState('');
    const [passwordCompareHint, setPasswordCompareHint] = useState('');

    const [showErrorView, setShowErrorView] = useState(false);
    const [errorCode, setErrorCode] = useState(CODE.OK);
    const [passwords, setPasswords] = useState(defaultPasswords);

    const [status, setStatus] = useState("");


    const onReset = (event) => {
        event.preventDefault();
        setStatus("");
        setPasswords(defaultPasswords);
        setPasswordHint('');
        setPasswordCompareHint('');
    }

    const onSubmit = async (event) => {
        setStatus("");
        let {password, passwordCompare} = event.value;

        setPasswordHint('');
        setPasswordCompareHint('');

        if (!checkPassword(password)) {
            setPasswordHint(t('general.error.password.required'));
            return;
        }

        if (passwordCompare === '') {
            setPasswordCompareHint(t('updatepassword.new.password.compare.required'));
            return;
        }

        if (passwordCompare !== password) {
            setPasswordCompareHint(t('updatepassword.passwords.dont.match'));
            return;
        }

        let result = await restPutUpdateMemberPassword(getAccount().email, password);
        let code = result.code;


        if (code === CODE.NO_ENTRY_FOUND) {
            code = CODE.FORCED_LOGOUT;
        }

        switch (code) {
            case CODE.INVALID_PASSWORD:
                setPasswordHint(t('updatepassword.password.wrong.format'));
                break;
            case CODE.OK:
                setPasswords(defaultPasswords);
                setStatus(t('updatepassword.password.saved'));
                break;
            default:
                setErrorCode(code);
                setShowErrorView(true);
        }
    };

    return (
        <Grommet theme={THEME}>
            <>
                {!showErrorView &&
                <>
                    <Layer
                        onEsc={onClose}
                        onClickOutside={onClose}
                    >
                        <Card
                            height={{min: "75vh", max: "75svh"}}
                            width={{min: "60vh", max: "60vh"}}
                            align={"center"}
                            border={{size: "medium", color: "brand"}}
                            round={false}
                            background={"light-1"}
                        >
                            <CardHeader pad="small" alignSelf={"center"}>
                                <Heading level={3} margin={"medium"} color={"brand"}>
                                    {t('updatepassword.title')}
                                </Heading>
                            </CardHeader>
                            <CardBody pad="small" alignSelf={"center"}>

                                <Form
                                    value={passwords}
                                    onChange={nextValue => {
                                        setPasswords(nextValue)
                                        setPasswordHint('');
                                        setPasswordCompareHint('');
                                    }
                                    }
                                    onReset={onReset}
                                    onSubmit={onSubmit}
                                >
                                    <FormField name="password" htmlfor="password" error={passwordHint}
                                               label={t('updatepassword.new.password')}>
                                        <TextInput type="password" id="password" name="password"/>
                                    </FormField>
                                    <FormField name="passwordCompare" htmlfor="passwordCompare"
                                               error={passwordCompareHint}
                                               label={t('updatepassword.new.password.compare')}>
                                        <TextInput type="password" id="passwordCompare" name="passwordCompare"/>
                                    </FormField>
                                    <Box direction="row" gap="small">
                                        <Button type="submit" margin="small" primary
                                                label={t('general.submit')}/>
                                        <Button type="reset" margin="small" primary
                                                label={t('general.reset')}/>
                                    </Box>
                                </Form>
                                <Box direction="row" alignSelf={"center"}>
                                    <Text weight={"bold"} margin={{top: "medium"}} alignSelf={"center"}>{status}</Text>
                                </Box>
                            </CardBody>
                            <CardFooter pad={{horizontal: "medium"}} alignSelf={"center"}>
                                <Box direction="row" margin={{top: "medium", bottom: "small"}} alignSelf={"center"}>
                                    <Button
                                        icon={<Close/>}
                                        hoverIndicator
                                        onClick={onClose}
                                    >
                                    </Button>
                                </Box>
                            </CardFooter>
                        </Card>

                    </Layer>
                </>
                }

                {showErrorView &&
                <ErrorView errorCode={errorCode}></ErrorView>
                }
            </>
        </Grommet>
    );
}
