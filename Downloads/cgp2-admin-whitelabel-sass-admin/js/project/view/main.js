Ext.Loader.setPath({
    enabled: true,
    'CGP.project': path + 'js/project'
});
Ext.onReady(function () {


    var store = Ext.create("CGP.project.store.Project");
    var controller = Ext.create('CGP.project.controller.Main');
    window.controller = controller;

    projectPage = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('project'),
        block: 'project',
        editPage: 'edit.html',
        activeBtn: ['load', 'delete', 'export'],
        tbarCfg: {
            hiddenButtons: ['config', 'create', 'delete']
        },
        gridCfg: {
            store: store,
            editAction: false,
            deleteAction: false,
            frame: false,
            columns: [{
                text: i18n.getKey('id'),
                dataIndex: 'id',
                itemId: 'id',
                sortable: true,
                tdCls: 'vertical-middle',
                width: 80
            }, {
                text: i18n.getKey('customerEmail'),
                dataIndex: 'user',
                itemId: 'email',
                tdCls: 'vertical-middle',
                sortable: false,
                width: 150,
                renderer: function (value) {
                    if (value == null || value.emailAddress == null) return '';
                    return value.emailAddress;
                }
            }, {
                text: i18n.getKey('thumbnail'),
                itemId: 'thumbnail',
                width: 120,
                tdCls: 'vertical-middle',
                renderer: function (value, metadata, record) {
                    /*if (record.get('product') == null || record.get('product').medias == null) {
                        return '';
                    }*/

                    var url = projectThumbServer + record.get('thumbnail');
                    return new Ext.XTemplate("<a href='javascript:{handler}'><img src='{url}/100/100' /></a>").apply({
                        handler: 'controller.preview("' + record.get("productInstanceId") + '")',
                        url: url
                    });
                }
            }, {
                text: i18n.getKey('name'),
                dataIndex: 'name',
                itemId: 'name',
                sortable: false,
                tdCls: 'vertical-middle',
                width: 180,
                renderer: function (value, metadata) {
                    metadata.tdAttr = "data-qtip='" + value + "'";
                    return value;
                }
            },{
                text: i18n.getKey('createdDate'),
                dataIndex: 'createdDate',
                itemId: 'createdDate',
                sortable: true,
                tdCls: 'vertical-middle',
                width: 150,
                renderer: function (value, metadata) {
                    var dateFormat = "Y-m-d H:i:s";
                    metadata.style = "color:gray";
                    if (!Ext.isEmpty(value)) {
                        return Ext.Date.format(value, dateFormat);
                    }
                }
            }, {
                xtype: 'componentcolumn',
                width: 180,
                flex: 1,
                itemId: 'productInstance',
                tdCls: 'vertical-middle',
                sortable: false,
                text: i18n.getKey('productInstance'),
                renderer: function (value, metaData, record, rowIndex) {
                    return new Ext.button.Button({
                        text: '<div>' + i18n.getKey('check') + '</div>',
                        frame: false,
                        width: 100,
                        tooltip: i18n.getKey('check') + i18n.getKey('productInstance'),
                        baseCls: 'uxGridBtn',
                        style: {
                            background: '#F5F5F5'
                        },
                        handler: function (comp) {
                            Ext.Ajax.request({
                                url: adminPath + 'api/bom/productInstances/' + record.get('productInstanceId') + '/V2?includeReferenceEntity=false',
                                method: 'GET',
                                headers: {
                                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                },
                                success: function (response, options) {
                                    var resp = Ext.JSON.decode(response.responseText);
                                    if (resp.success) {
                                        var valueString = JSON.stringify(resp.data, null, "\t");

                                        var win = Ext.create("Ext.window.Window", {
                                            id: "pageContentItemPlaceholders",
                                            modal: true,
                                            layout: 'fit',
                                            title: i18n.getKey('productInstances'),
                                            items: [
                                                {
                                                    xtype: 'textarea',
                                                    fieldLabel: false,
                                                    width: 900,
                                                    height: 700,
                                                    value: valueString
                                                }
                                            ]
                                        });
                                        win.show();


                                    } else {
                                        Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + resp.data.message)
                                    }
                                },
                                failure: function (response, options) {
                                    var object = Ext.JSON.decode(response.responseText);
                                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
                                }
                            });

                        }

                    });

                }

            }]
        },
        filterCfg: {
            items: [{
                id: 'idSearchField',
                name: 'id',
                hideTrigger: true,
                autoStripChars: true,
                allowExponential: false,
                allowDecimals: false,
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                id: 'emailSearchField',
                name: 'user.emailAddress',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('customerEmail'),
                itemId: 'email'
            }, {
                id: 'nameSearchField',
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            },
                {
                    id: 'createdDate',
                    style: 'margin-right:50px; margin-top : 0px;',
                    name: 'createdDate',
                    xtype: 'datefield',
                    scope: true,
                    itemId: 'createdDate',
                    fieldLabel: i18n.getKey('createdDate'),
                    width: 360,
//                    itemXType: 'datefield',
                    format: 'Y/m/d'
                    //                    scope: true,
                    //                    width: 218
                }]
        }
    });
});