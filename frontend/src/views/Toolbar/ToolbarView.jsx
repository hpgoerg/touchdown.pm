/**
 * @module ToolBarView
 *
 * @description
 * The toolbar view of the application
 *
 * @author Hans-Peter Görg
 **/
import React, {useState} from "react";
import AccountView from "../Account/AccountView";

import {
    Grommet,
    Anchor,
    Menu,
    Box,
    Heading,
    Text
} from "grommet";
import {Home, Apps, Power, User, CircleQuestion} from 'grommet-icons';

import {useTranslation} from "react-i18next";
import {hasActiveAccount, isAdmin} from "../../model/account";
import {logout} from "../../action/actionLogout";
import {useHistory} from 'react-router-dom';
import UpdatePasswordView from "../UpdatePassword/UpdatePasswordView";
import HelpViewContainer from "../Help/HelpViewContainer";
import {setHelpContextId} from "../Help/HelpContext";
import {HELP_CONTEXT_ID} from "../../shared/constants/enums";
import {THEME} from "../../configTheme";


export default function ToolbarView({status, subject}) {

    const history = useHistory();

    const {t} = useTranslation();
    const [isLoggedIn, setIsLoggedIn] = useState(hasActiveAccount());
    const [showAccount, setShowAccount] = useState(false);
    const [showUpdatePassword, setShowUpdatePassword] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    const onClickHome = (e) => {
        e.preventDefault();
        setHelpContextId(HELP_CONTEXT_ID.GENERAL);
        history.push("/");
    };

    const onClickLogin = (e) => {
        e.preventDefault();
        history.push("/login");
    };

    const onClickLogout = (e) => {
        e.preventDefault();
        logout();
        setIsLoggedIn(false);
        history.push("/");
    };

    const onCloseAccount = (e) => {
        e.preventDefault();
        setShowAccount(false);
    };

    const onCloseUpdatePassword = (e) => {
        e.preventDefault();
        setShowUpdatePassword(false);
    };

    const cannotEditMembers = () => {
        return !isAdmin();
    }

    const onClickHelp = () => {
        setShowHelp(true);
    };

    const onCloseHelp = () => {
        setShowHelp(false);
    }

    return (
        <Grommet theme={THEME}>
            <Box
                tag="header"
                direction="row"
                background={"brand"}
                align="center"
                elevation="medium"
                justify="between"
                responsive={false}
                pad={{vertical: "xsmall"}}
                style={{position: "relative"}}
            >
                <Box
                    flex={false}
                    direction="row"
                    align="center"
                    margin={{left: "small"}}
                >
                    <Anchor icon={<Home size={'large'}/>} hoverIndicator onClick={onClickHome}></Anchor>
                    <Heading level="4" margin={{left: "small", right: "small", vertical: "none"}}>
                        {t('toolbar.title')}
                    </Heading>
                    <Heading level="4" margin={{left: "small", vertical: "none"}}>
                        {subject}
                    </Heading>
                </Box>

                <Box direction="row" align="center">
                    <Box
                        margin={{left: "medium"}}
                        round="xsmall"
                        direction="row"
                        align="center"
                        pad={{horizontal: "small"}}
                    >
                        <Text margin={{right: "xlarge"}}>{status}</Text>
                        <Menu disabled={!isLoggedIn}
                              margin={{left: "xlarge", right: "xlarge"}}
                              label={t('toolbar.subject.title')}
                              dropBackground={"light-1"}
                              items={[
                                  {
                                      label: t('toolbar.epics.title'), onClick: () => {
                                          history.push('/epics');
                                      }
                                  },
                                  {
                                      label: t('toolbar.userstories.title'), onClick: () => {
                                          history.push('/userstories');
                                      }
                                  },
                                  {
                                      label: t('toolbar.sprints.title'), onClick: () => {
                                          history.push('/sprints');
                                      }
                                  },
                                  {
                                      label: t('toolbar.releases.title'), onClick: () => {
                                          history.push('/releases');
                                      }
                                  },
                                  {
                                      label: t('toolbar.impediments.title'), onClick: () => {
                                          history.push('/impediments');
                                      }
                                  },
                                  {
                                      label: t('toolbar.members.title'), disabled: cannotEditMembers(), onClick: () => {
                                          history.push('/members');
                                      }
                                  }
                              ]}

                              icon={<Apps size={'large'} color={"accent-1"}/>}
                        >
                        </Menu>
                    </Box>

                    {!isLoggedIn &&
                    <Menu
                        margin={{left: "xlarge", right: "xlarge"}}
                        label={t('toolbar.account')}
                        dropBackground={"light-2"}

                        items={[
                            {
                                label: <Box gap={"small"} alignSelf={"center"}>{t('toolbar.login')}</Box>,
                                onClick: (e) => onClickLogin(e),
                                icon: (
                                    <Box pad="small">
                                        <Power size="medium"/>
                                    </Box>
                                ),
                            }
                        ]}
                        icon={<User size={'large'} color={"accent-1"}/>}
                    >

                    </Menu>
                    }

                    {isLoggedIn &&
                    <Menu
                        margin={{left: "xlarge", right: "xlarge"}}
                        label={t('toolbar.account')}
                        dropBackground={"light-1"}

                        items={[
                            {label: "", hoverIndicator: "false"},
                            {
                                label:
                                    <Box alignSelf={"center"}>{t('toolbar.show.account')}</Box>,
                                onClick: () => setShowAccount(true)
                            },
                            {
                                label:
                                    <Box alignSelf={"center"}>{t('toolbar.account.change.password')}</Box>,
                                onClick: () => setShowUpdatePassword(true)
                            },
                            {
                                label:
                                    <Box alignSelf={"center"}>{t('toolbar.logout')}</Box>,
                                onClick: (e) => onClickLogout(e),
                                icon: (
                                    <Box pad="small">
                                        <Power size="medium"/>
                                    </Box>
                                ),
                            }
                        ]}
                        icon={<User size={'large'} color={"accent-1"}/>}
                    >
                    </Menu>
                    }
                    <Text color={"white"}>Help</Text>
                    <Anchor
                        icon={<CircleQuestion
                            size={'large'}/>}
                        hoverIndicator
                        onClick={onClickHelp}
                        reverse={true}>
                    </Anchor>
                </Box>
            </Box>

            {showHelp &&
                <HelpViewContainer onCloseHelp={onCloseHelp}></HelpViewContainer>
            }

            {showAccount &&
            <AccountView onClose={onCloseAccount}>
            </AccountView>
            }

            {showUpdatePassword &&
            <UpdatePasswordView onClose={onCloseUpdatePassword}>
            </UpdatePasswordView>
            }

        </Grommet>
    );
}
