/**
 * @module EditTableMeasuresViewPresenter
 *
 * @description
 * Presenter part of the view component to edit impediment measures
 *
 * @author Hans-Peter Görg
 **/
import React, {useEffect} from 'react';
import {Box, DataTable, Text, TextInput, Button, Grommet, Keyboard} from 'grommet';
import {Close, Checkmark} from "grommet-icons";



export default function EditTableMeasuresViewPresenter(
    {
        ThemeEditTable, searchField, columns, data, sort, setSort, editData, setEditData, onChangeDataEntry,
        onClickEditEntry, onClickNewEntry,
        errorEditTable, resetMeasureEdit, setResetMeasureEdit, editHint
    }
) {

    useEffect(() => {
        setEditData('');
        setResetMeasureEdit(false);
    }, [resetMeasureEdit, setEditData, setResetMeasureEdit]);

    return (
        <>
            <Box align={"start"} pad={"medium"}>
                <DataTable
                    columns={columns.map(col => ({
                        ...col,
                        search: col.property === searchField
                    }))}
                    data={data}
                    sort={sort}
                    onSort={setSort}
                    size={"medium"}
                >
                </DataTable>


                <Box direction={"row"} size={"large"} margin={{top: "large"}}>
                    <Box direction={"column"} alignSelf={"start"} width={{min: "50vh", max: "50vh"}}>
                        <Text size={"small"} color={"brand"}>{editHint}</Text>
                        <Grommet theme={ThemeEditTable}>
                            <Keyboard onEnter={onClickEditEntry} onEsc={onClickNewEntry}>
                                <TextInput margin={{top: "medium"}} full
                                           value={editData}
                                           onChange={onChangeDataEntry}
                                >
                                </TextInput>
                            </Keyboard>
                        </Grommet>
                    </Box>
                </Box>

                <Box direction={"row"}>
                    <Box direction={"column"}>
                        <Button
                            onClick={onClickEditEntry}
                            icon={<Checkmark size={"medium"} color={"brand"}></Checkmark>}
                            disabled={editData === ''}
                        >
                        </Button>
                    </Box>
                    <Box direction={"column"} margin={{left: "small"}}>
                        <Button secondary
                                onClick={onClickNewEntry}
                                icon={<Close size={"medium"}></Close>}
                        >
                        </Button>
                    </Box>
                </Box>
                {(errorEditTable !== '') &&
                <Box direction={"row"} size={"large"} margin={{top: "xxsmall"}}>
                    <Text size={"xsmall"} color={"red"}>{errorEditTable}</Text>
                </Box>
                }
            </Box>
        </>
    );
}
