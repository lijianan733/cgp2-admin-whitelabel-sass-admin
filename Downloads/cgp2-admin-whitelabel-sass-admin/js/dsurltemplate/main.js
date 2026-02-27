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
        i18nblock: i18n.getKey('dsurltemplate'),
        block: 'dsurltemplate',
        editPage: 'edit.html',
        //权限控制
        //accessControl: true,
        gridCfg: {
            store: Ext.create("CGP.dsurltemplate.store.UrlTemplate"),
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
                    sortable: true,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('requestTemplateId'),
                    dataIndex: 'requestTemplateId',
                    xtype: 'componentcolumn',
                    itemId: 'requestTemplateId',
                    sortable: false,
                    width: 120,

                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="查看requestTemplate"';
                        if (value == 0) {
                            return ""
                        }
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" id="click-dataSource" style="color: blue">' + value + '</a>',
                            listeners: {
                                render: function (display) {
                                    var clickElement = document.getElementById('click-dataSource');
                                    clickElement.addEventListener('click', function () {
                                        JSOpen({
                                            id: 'dataSourcepepage',
                                            url: path + 'partials/dsrequesttemplate/main.html?dataSourceId=' + value,
                                            title: i18n.getKey('dsrequesttemplate'),
                                            refresh: true
                                        })
                                    }, false);

                                }
                            }
                        }
                    }

                },
                {
                    text: i18n.getKey('template'),
                    dataIndex: 'template',
                    xtype: 'gridcolumn',
                    width: 200,
                    itemId: 'template',
                    sortable: true,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    xtype: 'gridcolumn',
                    width: 200,
                    itemId: 'description',
                    sortable: true,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('variables'),
                    dataIndex: 'variables',
                    xtype: 'componentcolumn',
                    width: 120,
                    itemId: 'variables',
                    sortable: true,
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        if (value) {
                            var strValue = JSON.stringify(value, null, "\t");
                            metadata.tdAttr = 'data-qtip="查看variables"';
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" id="click-dsurltemplate" style="color: blue;text-decoration:none">' + i18n.getKey('check') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var clickElement = document.getElementById('click-dsurltemplate');
                                        clickElement.addEventListener('click', function () {
                                            var win = Ext.create("Ext.window.Window", {
                                                id: "variables",
                                                modal: true,
                                                layout: 'fit',
                                                title: i18n.getKey('variables'),
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
                    id: 'requestTemplateId',
                    name: 'requestTemplateId',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('requestTemplateId'),
                    itemId: 'requestTemplateId'
                },
                {
                    id: 'description',
                    name: 'description',
                    xtype: 'textfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description'
                }
            ]
        }

    });
});