/**
 * @module SearchView
 *
 * @description
 * View dialog to search for an epic, a userstory, an impediment, a release, a member or a sprint
 *
 * @author Hans-Peter Görg
 **/
import React, {useEffect, useState} from 'react';
import {Layer, Box, DataTable, Button, Heading, Text} from 'grommet';
import {restGetAll} from "../../service/serviceGetRest";
import {isAuthorizationErrorCode, isCriticalCode} from "../../shared/util/generalUtils";
import {Close} from "grommet-icons";
import {CODE} from "../../shared/constants/code";


export default function SearchView({subject, column, header, title, setShowSearch, setErrorCode, setShowErrorView, onSelectDoc}) {

    const [docs, setDocs] = useState([]);
    const [sort, setSort] = useState({
        property: column,
        direction: 'asc'
    });

    const getField = (doc) => {
        switch (column) {
            case 'email':
                return doc.email;
            case 'releasenr':
                return doc.releasenr;
            default:
                return doc.name;
        }
    };

    const columns = [
        {
            property: column,
            render: doc => (
                <Text size={"small"}>{getField(doc)}</Text>
            ),
            header: header
        }
    ];

    const onClose = (e) => {
        e.preventDefault();

        setShowSearch(false);
    };

    const onClickRow = (event) => {
        onSelectDoc(event.datum);
        setShowSearch(false);
    };


    useEffect(() => {
        const getDocs = async () => {
            let result = await restGetAll(subject);

            if (isAuthorizationErrorCode(result.code) || isCriticalCode(result.code)) {
                setErrorCode(result.code);
                setShowErrorView(true);
            } else {
                if (result.code === CODE.NO_ENTRIES_FOUND) {
                    setDocs([]);
                } else {
                    setDocs(result.documents);
                }
            }
        }
        getDocs();
    }, [setErrorCode, setShowErrorView, subject]);


    return (
        <Layer
            onClickOutside={onClose}
            onEsc={onClose}
        >
            <Box align={"center"}
                 border={{size: "medium", color: "brand"}}
                 round={false}
                 background={"light-1"}
            >
                <Heading level={3} margin={"medium"} color={"brand"}>{title}</Heading>
                <DataTable
                    columns={columns.map(col => ({
                        ...col,
                        search: col.property === column
                    }))}
                    data={docs}
                    sort={sort}
                    onSort={setSort}
                    onClickRow={onClickRow}
                    size={"medium"}
                    step={docs.length}
                >
                </DataTable>
                <Box direction={"row"}>
                    <Button secondary icon={<Close size={"medium"}/>} margin={{top: "medium"}}
                            onClick={onClose}
                    >
                    </Button>
                </Box>
            </Box>
        </Layer>
    );
}
