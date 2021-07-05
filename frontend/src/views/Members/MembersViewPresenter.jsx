/**
 * @module MembersViewPresenter
 *
 * @description
 * Presenter part of the view to edit members
 *
 * @author Hans-Peter Görg
 **/
import React from 'react';

import {
    Grommet,
    Form,
    FormField,
    TextInput,
    Box,
    Button,
    Grid,
    RadioButtonGroup
} from 'grommet';
import {Search} from 'grommet-icons';
import {useTranslation} from "react-i18next";

import ToolbarView from "../Toolbar/ToolbarView";
import ErrorView from "../shared/ErrorView";
import SearchView from "../shared/SearchView";
import {ROLE} from "../../shared/constants/enums";
import Tooltip from "react-tooltip-lite";
import {THEME, TOOLTIP_COLOR} from "../../configTheme";


export default function MembersViewPresenter(
    {
        status, doc, setDoc, areInputsValid, createDoc, updateDoc, setShowSearch, errorName, errorFirstname, errorPassword,
        onClickNew, deletable, onClickDelete,
        onClickHome, errorCode, showErrorView, setErrorCode, setShowErrorView, onSelectDoc, showSearch,
        errorEmail
    }) {

    const {t} = useTranslation();
    const DUMMY_NEW_ID = 'NEW';


    return (
        <Grommet theme={THEME}>

            <ToolbarView status={status} subject={t('members.view.title')}></ToolbarView>

            {!showErrorView &&
            <Grid align="stretch"
                  areas={[                    //column, row
                      {name: 'left', start: [0, 1], end: [0, 1]},
                      {name: 'content', start: [1, 1], end: [1, 1]},
                      {name: 'right', start: [2, 1], end: [2, 1]},
                  ]}
                  columns={['auto', 'xlarge', 'auto']}
                  rows={['xxsmall', 'medium']}
                  gap='small'
            >
                <Box gridArea='left'></Box>

                <Box gridArea="content">
                    <Form
                        value={doc}
                        onChange={nextValue => {
                            setDoc(nextValue);
                        }
                        }
                        onSubmit={async (event) => {
                            let isValid = areInputsValid(event.value);
                            if (isValid) {
                                if (event.value._id === DUMMY_NEW_ID) {
                                    await createDoc(event.value);
                                } else {
                                    await updateDoc(event.value);
                                }
                            }
                        }}
                    >
                        <Box direction={"row"}>
                            <Box direction={"column"} width={"large"}>

                                <Box direction="row" gap={"xlarge"} margin={{bottom: "medium"}}>
                                    <Tooltip content={t('members.view.search.title')} direction={"right"} color={TOOLTIP_COLOR} arrow={false}>
                                        <Button primary
                                                onClick={() => setShowSearch(true)}
                                                icon={<Search size={'medium'}></Search>}
                                        >
                                        </Button>
                                    </Tooltip>
                                </Box>

                                <FormField htmlfor="name" label={t('members.view.name')} error={errorName}
                                           name={"name"}>
                                    <TextInput id="name" name="name"/>
                                </FormField>

                                <FormField htmlFor={"firstname"} name={"firstname"}
                                           label={t('members.view.firstname')} error={errorFirstname}>
                                    <TextInput id="firstname" name="firstname"/>
                                </FormField>

                                <FormField htmlFor={"email"} name={"email"}
                                           label={t('members.view.email')} error={errorEmail}>
                                    <TextInput id="email" name="email"/>
                                </FormField>

                                {(doc._id === DUMMY_NEW_ID) &&
                                <FormField name="password" htmlfor="password" error={errorPassword}
                                           label={t('login.password')}>
                                    <TextInput type="password" id="password" name="password"/>
                                </FormField>
                                }

                                <Box direction={"row"} gap={"large"} margin={{top: "large"}}>
                                    <Box direction={"column"}>
                                        <Button type={"submit"} primary label={t('general.submit')} name="save"
                                                id={"save"}/>
                                    </Box>

                                    <Box direction={"column"}>
                                        <Button secondary label={t('general.new')} name={"new"} id={"new"}
                                                onClick={onClickNew}>
                                        </Button>
                                    </Box>

                                    <Box direction={"column"}>
                                        <Button secondary label={t('general.delete')} name={"delete"} id={"delete"}
                                                disabled={!deletable} onClick={onClickDelete}/>
                                    </Box>
                                </Box>

                            </Box>


                            <Box direction={"column"} width={"small"}></Box>

                            <Box direction={"column"} width={"medium"} margin={{top: "medium"}}>

                                <FormField htmlFor={"role"} name={"role"}
                                           label={t('members.view.role')}
                                           margin={{top: "large", bottom: "medium"}}>
                                    <RadioButtonGroup
                                        name={"role"}
                                        options={[
                                            {label: t('role.teammember'), value: ROLE.SCRUMTEAMMEMBER},
                                            {label: t('role.scrummaster'), value: ROLE.SCRUMMASTER},
                                            {label: t('role.productowner'), value: ROLE.PRODUCTOWNER},
                                            {label: t('role.stakeholder'), value: ROLE.STAKEHOLDER},
                                            {label: t('role.admin'), value: ROLE.ADMIN},
                                        ]}>
                                    </RadioButtonGroup>

                                </FormField>
                            </Box>

                        </Box>

                    </Form>
                </Box>

                <Box gridArea='right'/>

            </Grid>
            }

            {showSearch &&
            <SearchView
                subject={"member"}
                column={"email"}
                header={t('members.view.email')}
                title={t('members.view.search.title')}
                setShowSearch={setShowSearch}
                setErrorCode={setErrorCode}
                setShowErrorView={setShowErrorView}
                onSelectDoc={onSelectDoc}>
            </SearchView>
            }

            {showErrorView &&
            <ErrorView handleClose={onClickHome} errorCode={errorCode}></ErrorView>
            }

        </Grommet>
    );
}
