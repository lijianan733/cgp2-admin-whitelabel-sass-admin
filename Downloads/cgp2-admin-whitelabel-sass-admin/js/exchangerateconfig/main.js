Ext.onReady(function () {
    var controller = Ext.create('CGP.exchangerateconfig.controller.Controller'),
        page = Ext.create('Ext.ux.ui.GridPage', {
            i18nblock: i18n.getKey('exchangerateconfig'),
            block: 'exchangerateconfig',
            editPage: 'edit.html',
            tbarCfg: {
                hiddenButtons: ['clear', 'config', 'help', 'export', 'import'],
                btnCreate: {
                    handler: function () {
                        JSOpen({
                            id: 'edit_exchangerateconfig',
                            url: path + `partials/exchangerateconfig/edit.html?type=create`,
                            refresh: true,
                            title: i18n.getKey('创建_汇率配置')
                        });
                    }
                },
                btnDelete: {
                    iconCls: 'icon_copy',
                    text: i18n.getKey('拷贝'),
                    handler: function () {
                        var grid = this.ownerCt.ownerCt,
                            selectItems = grid.getSelectionModel().getSelection(),
                            copyArray = selectItems.map(item => {
                                return item.getId();
                            }),
                            id = copyArray[0];

                        if (copyArray.length) {
                            JSOpen({
                                id: 'edit_exchangerateconfig',
                                url: path + `partials/exchangerateconfig/edit.html?_id=${id}&type=copy`,
                                refresh: true,
                                title: i18n.getKey('拷贝_汇率配置')
                            });
                        } else {
                            Ext.Msg.alert('提示', '请选择一条数据!');
                        }
                    }
                }
            },
            gridCfg: {
                store: Ext.create("CGP.exchangerateconfig.store.ExchangeRateConfig"),
                frame: false,
                showRowNum: false,
                editAction: false,
                deleteAction: false,
                columns: [
                    {
                        xtype: 'rownumberer',
                        itemId: 'rownumberer',
                        width: 45,
                        resizable: true,
                        menuDisabled: true,
                        autoSizeColumn: false,
                        align: 'center',
                        tdCls: 'vertical-middle',
                    },
                    {
                        xtype: 'componentcolumn',
                        tdCls: 'vertical-middle',
                        sortable: true,
                        width: 60,
                        dataIndex: 'id',
                        renderer: function (value, mateData, record, rowIndex, colIndex, store) {
                            var status = record.get('status');
                            return {
                                xtype: 'fieldcontainer',
                                hidden: status === 'RELEASE',
                                items: [
                                    {
                                        xtype: 'button',
                                        iconCls: 'icon_edit icon_margin',
                                        itemId: 'actionedit',
                                        tooltip: 'Edit',
                                        componentCls: "btnOnlyIcon",
                                        handler: function () {
                                            var id = record.get('id');
                                            JSOpen({
                                                id: 'edit_exchangerateconfig',
                                                url: path + `partials/exchangerateconfig/edit.html?_id=${id}&type=edit`,
                                                refresh: true,
                                                title: i18n.getKey('编辑_汇率配置')
                                            });
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        iconCls: 'icon_remove icon_margin',
                                        itemId: 'actionremove',
                                        tooltip: 'Remove',
                                        componentCls: "btnOnlyIcon",
                                        handler: function () {
                                            var id = record.get('id'),
                                                url = adminPath + `api/exchangeRateSets/${id}`;

                                            Ext.Msg.confirm('提示', '是否删除？', function (selector) {
                                                if (selector === 'yes') {
                                                    controller.deleteQuery(url, function () {
                                                        store.load();
                                                    });
                                                }
                                            });
                                        }
                                    }
                                ]
                            };
                        }
                    },
                    {
                        xtype: 'atagcolumn',
                        text: i18n.getKey("id"),
                        dataIndex: 'id',
                        width: 200,
                        align: 'center',
                        sortable: false,
                        getDisplayName: function (value, metaData, record) {
                            return JSCreateHyperLink(value);
                        },
                        clickHandler: function (value, metaData, record) {
                            JSOpen({
                                id: 'edit_exchangerateconfig',
                                url: path + `partials/exchangerateconfig/edit.html?_id=${value}&type=edit&readOnly=true`,
                                refresh: true,
                                title: i18n.getKey('查看_汇率配置')
                            });
                        }
                    },
                    {
                        text: i18n.getKey('汇率套'),
                        dataIndex: 'version',
                        itemId: 'version',
                        align: 'center',
                        width: 200,
                        sortable: true,
                    },
                    {
                        text: i18n.getKey('状态'),
                        dataIndex: 'status',
                        itemId: 'status',
                        align: 'center',
                        width: 200,
                        sortable: false,
                        bottomToolbarHeight: 30,
                        renderer: function (value, metadata) {
                            var statusGather = {
                                    'TEST': {
                                        color: 'red',
                                        text: '测试'
                                    },
                                    'RELEASE': {
                                        color: 'green',
                                        text: '上线'
                                    },
                                },
                                {color, text} = statusGather[value];

                            return JSCreateFont(color, true, text)
                        }
                    },
                    {
                        text: i18n.getKey('描述'),
                        dataIndex: 'description',
                        itemId: 'description',
                        align: 'center',
                        width: 250,
                        sortable: false,
                    },
                    {
                        xtype: 'atagcolumn',
                        text: i18n.getKey("已生效网站"),
                        dataIndex: 'usedPlatforms',
                        flex: 1,
                        sortable: false,
                        getDisplayName: function (value, metaData, record) {
                            var result = [];

                            if (value) {
                                value.forEach((item, index) => {
                                    if (index < 5) {
                                        result.push(item['name'])
                                    }
                                })

                                if (value.length > 4) {
                                    result += ` ${JSCreateHyperLink('查看更多')}`
                                }

                            }

                            return result
                        },
                        clickHandler: function (value, metaData, record) {
                            Ext.create('Ext.window.Window', {
                                title: i18n.getKey('查看_更多网站'),
                                modal: true,
                                constrain: true,
                                maxHeight: 550,
                                minHeight: 250,
                                width: 250,
                                layout: 'fit',
                                items: [
                                    {
                                        xtype: 'grid',
                                        header: false,
                                        store: {
                                            fields: ['name'],
                                            data: value
                                        },
                                        columns: [
                                            {
                                                xtype: 'rownumberer',
                                                align: 'center',  // 使内容居中
                                                width: 45
                                            },
                                            {
                                                text: i18n.getKey('网站名称'),
                                                dataIndex: 'name',
                                                align: 'center',  // 使内容居中
                                                flex: 1
                                            },
                                        ]
                                    }
                                ]
                            }).show();
                        }
                    },
                ]
            },
            filterCfg: {
                height: 80,
                layout: {
                    type: 'column',
                    columns: 4
                },
                defaults: {
                    margin: '5 20 5 0',
                },
                items: [
                    {
                        xtype: 'textfield',
                        name: '_id',
                        itemId: '_id',
                        isLike: false,
                        hideTrigger: true,
                        autoStripChars: true,
                        allowExponential: false,
                        allowDecimals: false,
                        fieldLabel: i18n.getKey('id'),
                    },
                    {
                        xtype: 'numberfield',
                        name: 'version',
                        itemId: 'version',
                        haveReset: true,
                        hideTrigger: true,
                        isLike: false,
                        fieldLabel: i18n.getKey('汇率套'),
                    },
                    {
                        xtype: 'combo',
                        name: 'status',
                        itemId: 'status',
                        fieldLabel: i18n.getKey('状态'),
                        isLike: false,
                        editable: false,
                        valueField: 'value',
                        displayField: 'display',
                        store: {
                            fields: ['value', 'display'],
                            data: [
                                {
                                    value: 'TEST',
                                    display: i18n.getKey('测试')
                                },
                                {
                                    value: 'RELEASE',
                                    display: i18n.getKey('上线')
                                }
                            ]
                        }
                    },
                ]
            }
        });
});