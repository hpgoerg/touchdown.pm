/**
 * @module ImpedimentsViewPresenter
 *
 * @description
 * Presenter part of the view to edit impediments
 *
 * @author Hans-Peter Görg
 **/
import React from 'react';

import {
    Grommet,
    Form,
    FormField,
    TextInput,
    TextArea,
    Box,
    Button,
    Grid
} from 'grommet';
import {Search} from 'grommet-icons';
import {useTranslation} from "react-i18next";

import ToolbarView from "../Toolbar/ToolbarView";
import ErrorView from "../shared/ErrorView";
import SearchView from "../shared/SearchView";
import EditTableMeasuresViewContainer from "./EditTableMeasuresViewContainer";
import Tooltip from "react-tooltip-lite";
import {THEME, TOOLTIP_COLOR} from "../../configTheme";

export default function ImpedimentsViewPresenter(
    {
        status, doc, setDoc, areInputsValid, createDoc, updateDoc, setShowSearch, errorName, errorDescription,
        onClickNew, deletable, onClickDelete,
        onClickHome, errorCode, showErrorView, setErrorCode, setShowErrorView, onSelectDoc, showSearch,
        measures, setMeasures, resetMeasureEdit, setResetMeasureEdit
    }) {

    const {t} = useTranslation();
    const DUMMY_NEW_ID = 'NEW';

    return (
        <Grommet theme={THEME}>

            <ToolbarView status={status} subject={t('impediments.view.title')}></ToolbarView>

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
                            event.value.measures = measures;
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
                            <Box direction={"column"} width={"xlarge"}>

                                <Box direction="row" gap={"xlarge"} margin={{bottom: "medium"}}>
                                    <Tooltip content={t('impediments.view.search.title')} direction={"right"} color={TOOLTIP_COLOR} arrow={false}>
                                        <Button primary
                                                onClick={() => setShowSearch(true)}
                                                icon={<Search size={'medium'}></Search>}
                                        >
                                        </Button>
                                    </Tooltip>
                                </Box>

                                <FormField htmlfor="name" label={t('impediments.view.name')} error={errorName}
                                           name={"name"}>
                                    <TextInput id="name" name="name"/>
                                </FormField>

                                <FormField htmlFor={"description"} name={"description"}
                                           label={t('impediments.view.description')} error={errorDescription}>
                                    <TextArea name="description" id={"description"} size={"medium"}>
                                    </TextArea>
                                </FormField>

                                <Box direction={"row"} gap={"large"} margin={{top: "large"}}>
                                    <Box direction={"column"}>
                                        <Button type={"submit"} primary label={t('general.submit')} name="save" id={"save"}/>
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

                            <Box direction={"column"} width={"medium"}></Box>

                            <Box direction={"column"} width={"xlarge"} margin={{top: "large"}}>
                                <EditTableMeasuresViewContainer
                                    data={measures}
                                    setData={setMeasures}
                                    resetMeasureEdit={resetMeasureEdit}
                                    setResetMeasureEdit={setResetMeasureEdit}
                                >
                                </EditTableMeasuresViewContainer>
                            </Box>
                        </Box>
                    </Form>
                </Box>

                <Box gridArea='right'/>

            </Grid>
            }

            {showSearch &&
            <SearchView
                subject={"impediment"}
                column={"name"}
                header={t('impediments.view.name')}
                title={t('impediments.view.search.title')}
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
