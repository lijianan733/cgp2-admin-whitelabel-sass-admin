/**
 * Created by admin on 2019/4/10.
 */
Ext.onReady(function () {

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('dsdatasource'),
        block: 'dsdatasource',
        editPage: 'edit.html',
        //权限控制
        //accessControl: true,
        gridCfg: {
            store: Ext.create("CGP.dsdatasource.store.DsdataSource"),
            frame: false,
            columnDefaults: {
                autoSizeColumn: true
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    itemId: '_id',
                    sortable: true
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'type',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'type',
                    sortable: true
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'description',
                    sortable: true,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('version'),
                    dataIndex: 'version',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'version',
                    sortable: true,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('selectors'),
                    dataIndex: 'selectors',
                    xtype: 'componentcolumn',
                    width: 120,
                    itemId: 'selectors',
                    sortable: true,
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        if (value) {
                            var strValue = JSON.stringify(value, null, "\t");
                            metadata.tdAttr = 'data-qtip="查看selectors"';
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" id="click-dataSource" style="color: blue;text-decoration: none">' + i18n.getKey('check') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var clickElement = document.getElementById('click-dataSource');
                                        clickElement.addEventListener('click', function () {
                                            var win = Ext.create("Ext.window.Window", {
                                                id: "selectors",
                                                modal: true,
                                                layout: 'fit',
                                                title: i18n.getKey('selectors'),
                                                items: [
                                                    {
                                                        xtype: 'textarea',
                                                        fieldLabel: false,
                                                        width: 600,
                                                        height: 400,
                                                        value: strValue
                                                    }
                                                ]
                                            });
                                            win.show();
                                        }, false);

                                    }
                                }
                            }
                        } else {
                            return "";
                        }
                    }
                }
            ]
        },
        // 搜索框
        filterCfg: {
            height: 120,
            defaults: {
                isLike: false
            },
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'numberfield',
                    listeners: {
                        render: function (comp) {
                            var pageContentSchemaId = getQueryString('dataSourceId');
                            if (pageContentSchemaId) {
                                comp.setValue(pageContentSchemaId);
                            }
                        }
                    },
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    id: 'type',
                    name: 'type',
                    xtype: 'combobox',
                    editable: false,
                    displayField: 'typeName',
                    valueField: 'value',
                    store: new Ext.data.Store({
                        fields: ['value', 'typeName'],
                        data: [
                            {
                                value: 'ImpactSvg',
                                typeName: 'ImpactSvg'
                            },
                            {
                                value: 'ImpactPdf',
                                typeName: 'ImpactPdf'
                            },
                            {
                                value: '',
                                typeName: i18n.getKey('allType')
                            }
                        ]
                    }),
                    value: '',
                    fieldLabel: i18n.getKey('type'),
                    itemId: 'type'
                },
                {
                    id: 'description',
                    name: 'description',
                    xtype: 'textfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description'
                },
                {
                    id: 'version',
                    name: 'version',
                    xtype: 'textfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('version'),
                    itemId: 'version'
                }
            ]
        }

    });
});