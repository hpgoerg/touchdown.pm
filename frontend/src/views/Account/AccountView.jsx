/**
 * @module AccountView
 *
 * @description
 * Dialog to show account data
 *
 * @author Hans-Peter Görg
 **/
import React from "react";

import {
    Heading,
    Button,
    Card, CardHeader, CardBody, CardFooter,
    Layer,
    Table, TableRow, TableCell, TableBody
} from "grommet";
import {Close} from 'grommet-icons';

import {useTranslation} from "react-i18next";
import {getAccount} from "../../model/account";


export default function AccountView({onClose}) {

    const {t} = useTranslation();
    const accountRoleText = t(getAccount().role);

    return (
            <Layer
                onEsc={onClose}
                onClickOutside={onClose}
            >
                <Card
                    height={{min: "30vh, max: 30vh"}}
                    width={{min: "50vh", max: "50vh"}}
                    border={{size: "medium", color: "brand"}}
                    round={false}
                    background={"light-1"}
                >
                    <CardHeader pad="small" alignSelf={"center"}>
                        <Heading level={3} margin={"medium"} color={"brand"}>
                            {t('account.header')}
                        </Heading>
                    </CardHeader>
                    <CardBody pad="medium">
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell scope="row">
                                        {t('account.name')}
                                    </TableCell>
                                    <TableCell>
                                        {`${getAccount().firstname} ${getAccount().name}`}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell scope="row">
                                        {t('account.email')}
                                    </TableCell>
                                    <TableCell>
                                        {`${getAccount().email}`}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell scope="row">
                                        {t('account.role')}
                                    </TableCell>
                                    <TableCell>{accountRoleText}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardBody>
                    <CardFooter pad={{horizontal: "small"}} alignSelf={"center"}>
                        <Button
                            icon={<Close/>}
                            hoverIndicator
                            onClick={onClose}
                        >
                        </Button>
                    </CardFooter>
                </Card>
            </Layer>
    );
}
