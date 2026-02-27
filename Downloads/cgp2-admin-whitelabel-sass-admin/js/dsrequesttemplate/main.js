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
        i18nblock: i18n.getKey('dsrequesttemplate'),
        block: 'dsrequesttemplate',
        editPage: 'edit.html',
        //权限控制
        //accessControl: true,
        gridCfg: {
            store: Ext.create("CGP.dsrequesttemplate.store.RequestTemplate"),
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
                    text: i18n.getKey('method'),
                    dataIndex: 'method',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'method'
                },
                {
                    text: i18n.getKey('urlTemplate'),
                    dataIndex: 'urlTemplate',
                    xtype: 'gridcolumn',
                    width: 250,
                    itemId: 'urlTemplate'
                },
                {
                    text: i18n.getKey('bodyTemplate'),
                    dataIndex: 'bodyTemplate',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'bodyTemplate',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'description',
                    sortable: true,
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
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
                    id: 'method',
                    name: 'method',
                    xtype: 'combobox',
                    editable: false,
                    displayField: 'typeName',
                    valueField: 'value',
                    store: new Ext.data.Store({
                        fields: ['value', 'typeName'],
                        data: [
                            {
                                value: 'POST',
                                typeName: 'POST'
                            },
                            {
                                value: 'GET',
                                typeName: 'GET'
                            },
                            {
                                value: '',
                                typeName: i18n.getKey('allMethod')
                            }
                        ]
                    }),
                    value: '',
                    fieldLabel: i18n.getKey('method'),
                    itemId: 'method'
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