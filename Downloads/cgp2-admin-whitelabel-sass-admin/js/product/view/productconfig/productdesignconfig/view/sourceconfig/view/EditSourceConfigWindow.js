/**
 * Created by nan on 2019/10/8.
 */
Ext.Loader.syncRequire([
    'CGP.common.field.RtTypeSelectField'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.view.EditSourceConfigWindow', {
    extend: 'Ext.window.Window',
    designId: null,
    layout: 'fit',
    createOrEdit: 'create',
    record: null,
    modal: true,
    sourceconfigstore: null,
    materialViewTypeIds: null,
    readOnly: false,
    alias: 'widget.editsourceconfigwindow',
    initComponent: function () {
        var me = this;
        if (me.record) {
            me.createOrEdit = 'edit';
        }
        me.title = i18n.getKey(me.createOrEdit) + i18n.getKey('sourceConfig');
        var templateConfigStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.managematerialviewtypetemplateConfig.store.TemplateConfigStore', {
            params: {
                filter: Ext.JSON.encode([{
                    name: 'designId',
                    type: 'string',
                    value: me.designId
                }])
            }
        });
        var simplifySBOMMaterialViewTypeStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.store.SimplifySBOMMaterialViewTypeStore', {
            params: {
                filter: Ext.JSON.encode([{
                    name: 'productConfigDesignId',
                    type: 'number',
                    value: me.designId
                }])
            }
        });
        var productMaterialViewCfgStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.store.ProductMaterialViewCfgStore', {
            params: {
                filter: Ext.JSON.encode([{
                    name: 'productConfigDesignId',
                    type: 'number',
                    value: me.designId
                }])
            }
        });
        var pageContentStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.store.PageContentStore');
        me.items = [
            {
                xtype: 'errorstrickform',
                itemId: 'form',
                border: false,
                padding:10,
                defaults: {
                    margin: '5 10 5 10',
                    allowBlank: false,
                    width: 500
                },
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('description'),
                        name: 'description',
                        itemId: 'description'
                    },
                    {
                        xtype: 'combo',
                        name: 'clazz',
                        fieldLabel: i18n.getKey('config') + i18n.getKey('type'),
                        itemId: 'clazz',
                        editable: false,
                        valueField: 'value',
                        multiSelect: false,
                        value: 'com.qpp.cgp.domain.preprocess.config.PageContentSourceConfig',
                        displayField: 'display',
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'value', 'display'
                            ],
                            data: [
                                {
                                    value: 'com.qpp.cgp.domain.preprocess.config.RtObjectSourceConfig',
                                    display: 'RtObjectSourceConfig'
                                },
                                {
                                    value: 'com.qpp.cgp.domain.preprocess.config.PageContentSourceConfig',
                                    display: 'PageContentSourceConfig'
                                },
                                {
                                    value: 'com.qpp.cgp.domain.preprocess.config.PageContentTemplateSourceConfig',
                                    display: 'PageContentTemplateSourceConfig'
                                },
                                {
                                    value: 'com.qpp.cgp.domain.preprocess.config.StaticPageContentLibrarySourceConfig',
                                    display: 'StaticPageContentLibrarySourceConfig'
                                }
                            ]
                        }),
                        mapping: {
                            common: [
                                'description', 'isNeedInitPageContent', 'clazz'
                            ],
                            'com.qpp.cgp.domain.preprocess.config.PageContentSourceConfig': [
                                'mvtType', /*'simplifyBomMaterialViewTypeId', 'productMaterialViewTypeId'*/
                            ],
                            'com.qpp.cgp.domain.preprocess.config.RtObjectSourceConfig': [
                                'rtTypeId'
                            ],
                            'com.qpp.cgp.domain.preprocess.config.PageContentTemplateSourceConfig': [
                                'productMaterialViewTypeTemplateConfigId'
                            ],
                            'com.qpp.cgp.domain.preprocess.config.StaticPageContentLibrarySourceConfig': [
                                'pageContents'
                            ]
                        },
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                var form = field.ownerCt;
                                for (var i = 0; i < form.items.items.length; i++) {
                                    var item = form.items.items[i];
                                    if (Ext.Array.contains(field.mapping['common'], item.itemId)) {

                                    } else if (Ext.Array.contains(field.mapping[newValue], item.itemId)) {
                                        item.show();
                                        item.setDisabled(false);
                                    } else {
                                        item.hide();
                                        item.setDisabled(true);
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: 'rttypeselectfield',
                        fieldLabel: i18n.getKey('rtType'),
                        itemId: 'rtTypeId',
                        name: 'rtTypeId',
                        hidden: true,
                        disabled: true,
                    },
                    {
                        xtype: 'combo',
                        name: 'mvtType',
                        fieldLabel: i18n.getKey('materialViewType') + i18n.getKey('type'),
                        itemId: 'mvtType',
                        editable: false,
                        valueField: 'value',
                        multiSelect: false,
                        displayField: 'display',
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'value', 'display'
                            ],
                            data: [
                                {
                                    value: 'productMaterialViewType',
                                    display: 'productMaterialViewType'
                                },
                                {
                                    value: 'simplifyMaterialViewType',
                                    display: 'simplifyMaterialViewType'
                                }
                            ]
                        }),
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                var form = field.ownerCt;
                                var simplifyBomMaterialViewTypeId = form.getComponent('simplifyBomMaterialViewTypeId');
                                var productMaterialViewTypeId = form.getComponent('productMaterialViewTypeId');
                                if (newValue == 'productMaterialViewType') {
                                    productMaterialViewTypeId.show();
                                    productMaterialViewTypeId.setDisabled(false);
                                    simplifyBomMaterialViewTypeId.hide();
                                    simplifyBomMaterialViewTypeId.setDisabled(true);
                                } else {
                                    productMaterialViewTypeId.hide();
                                    productMaterialViewTypeId.setDisabled(true);
                                    simplifyBomMaterialViewTypeId.show();
                                    simplifyBomMaterialViewTypeId.setDisabled(false);
                                }
                            }
                        }
                    },
                    {
                        fieldLabel: i18n.getKey('materialViewType'),
                        name: 'materialViewTypeId',
                        xtype: 'gridcombo',
                        editable: false,
                        displayField: 'name',
                        valueField: '_id',
                        store: simplifySBOMMaterialViewTypeStore,
                        hidden: true,
                        disabled: true,
                        itemId: 'simplifyBomMaterialViewTypeId',
                        gridCfg: {
                            height: 280,
                            columns: [
                                {
                                    dataIndex: '_id',
                                    text: i18n.getKey('id'),
                                    itemId: '_id',
                                    tdCls: 'vertical-middle',
                                    renderer: function (value, metadata) {
                                        metadata.tdAttr = 'data-qtip="' + value + '"';
                                        return value;
                                    }
                                },
                                {
                                    dataIndex: 'name',
                                    text: i18n.getKey('name'),
                                    itemId: 'name',
                                    flex: 1,
                                    tdCls: 'vertical-middle',
                                    renderer: function (value, metadata) {
                                        metadata.tdAttr = 'data-qtip="' + value + '"';
                                        return value;
                                    }
                                }

                            ],
                            bbar: Ext.create('Ext.PagingToolbar', {
                                store: simplifySBOMMaterialViewTypeStore,
                                emptyMsg: i18n.getKey('noData')
                            })
                        },
                        diyGetValue: function () {
                            var me = this;
                            var data = me.getSubmitValue();
                            if (data) {
                                return data[0]
                            }
                        }
                    },
                    {
                        fieldLabel: i18n.getKey('materialViewType'),
                        name: 'materialViewTypeId',
                        xtype: 'gridcombo',
                        editable: false,
                        displayField: 'name',
                        valueField: '_id',
                        hidden: true,
                        disabled: true,
                        store: productMaterialViewCfgStore,
                        itemId: 'productMaterialViewTypeId',
                        gridCfg: {
                            height: 280,
                            columns: [
                                {
                                    dataIndex: '_id',
                                    text: i18n.getKey('id'),
                                    itemId: '_id',
                                    tdCls: 'vertical-middle',
                                    renderer: function (value, metadata) {
                                        metadata.tdAttr = 'data-qtip="' + value + '"';
                                        return value;
                                    }
                                },
                                {
                                    dataIndex: 'name',
                                    text: i18n.getKey('name'),
                                    itemId: 'name',
                                    flex: 1,
                                    tdCls: 'vertical-middle',
                                    renderer: function (value, metadata) {
                                        metadata.tdAttr = 'data-qtip="' + value + '"';
                                        return value;
                                    }
                                }

                            ],
                            bbar: Ext.create('Ext.PagingToolbar', {
                                store: productMaterialViewCfgStore,
                                emptyMsg: i18n.getKey('noData')
                            })
                        },
                        diyGetValue: function () {
                            var me = this;
                            var data = me.getSubmitValue();
                            if (data) {
                                return data[0]
                            }
                        }
                    },
                    {
                        fieldLabel: i18n.getKey('template') + i18n.getKey('config'),
                        name: 'productMaterialViewTypeTemplateConfigId',
                        itemId: 'productMaterialViewTypeTemplateConfigId',
                        xtype: 'gridcombo',
                        editable: false,
                        displayField: '_id',
                        valueField: '_id',
                        hidden: true,
                        disabled: true,
                        store: templateConfigStore,
                        matchFieldWidth: false,
                        gridCfg: {
                            height: 280,
                            width: 500,
                            columns: [
                                {
                                    text: i18n.getKey('id'),
                                    dataIndex: '_id',
                                    itemId: '_id'
                                }, {
                                    text: i18n.getKey('fileType'),
                                    dataIndex: 'fileType',
                                    itemId: 'fileType'
                                }, {
                                    text: i18n.getKey('isCheck'),
                                    dataIndex: 'isCheck',
                                    itemId: 'isCheck'
                                }, {
                                    text: i18n.getKey('type'),
                                    dataIndex: 'clazz',
                                    flex: 1,
                                    itemId: 'clazz',
                                    renderer: function (value) {
                                        var result = '';
                                        if (value == 'com.qpp.cgp.domain.preprocess.template.PreprocessTemplateConfig') {
                                            result = '预处理模板';
                                        } else if (value == 'com.qpp.cgp.domain.preprocess.template.StaticProductMaterialViewTypeTemplateConfig') {
                                            result = '静态尺寸模板';
                                        } else {
                                            result = '可变尺寸模板';
                                        }
                                        return result;
                                    }
                                }
                            ],
                            bbar: Ext.create('Ext.PagingToolbar', {
                                store: templateConfigStore,
                                emptyMsg: i18n.getKey('noData')
                            })
                        },
                        diyGetValue: function () {
                            var me = this;
                            var data = me.getSubmitValue();
                            if (data) {
                                return data[0]
                            }
                        }
                    },
                    {
                        xtype: 'gridcombo',
                        fieldLabel: i18n.getKey('pageContents'),
                        name: 'pageContents',
                        itemId: 'pageContents',
                        displayField: 'name',
                        valueField: '_id',
                        editable: false,
                        hidden: true,
                        disabled: true,
                        store: pageContentStore,
                        matchFieldWidth: false,
                        multiSelect: true,
                        filterCfg: {
                            height: 80,
                            layout: {
                                type: 'column',
                                columns: 2
                            },
                            fieldDefaults: {
                                labelAlign: 'right',
                                layout: 'anchor',
                                width: 200,
                                style: 'margin-right:20px; margin-top : 5px;',
                                labelWidth: 50
                            },
                            items: [
                                {
                                    name: '_id',
                                    xtype: 'textfield',
                                    isLike: false,
                                    fieldLabel: i18n.getKey('id'),
                                    itemId: 'id'
                                }, {
                                    name: 'name',
                                    xtype: 'textfield',
                                    fieldLabel: i18n.getKey('name'),
                                    itemId: 'name'
                                }, {
                                    name: 'generateMode',
                                    xtype: 'combo',
                                    valueField: 'value',
                                    displayField: 'display',
                                    editable: false,
                                    isLike: false,
                                    hidden: true,
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['value', 'display'],
                                        data: [
                                            {
                                                value: 'auto',
                                                display: '自动创建'
                                            }, {
                                                value: 'manual',
                                                display: '人工创建'
                                            }]
                                    }),
                                    value: 'manual',
                                    fieldLabel: i18n.getKey('generateMode'),
                                    itemId: 'generateMode'
                                }
                            ]
                        },
                        gridCfg: {
                            store: pageContentStore,
                            selType: 'checkboxmodel',
                            height: 450,
                            width: 500,
                            columns: [
                                {
                                    text: i18n.getKey('id'),
                                    width: 120,
                                    dataIndex: '_id'
                                },
                                {
                                    text: i18n.getKey('name'),
                                    flex: 1,
                                    dataIndex: 'name',
                                }
                            ],
                            bbar: Ext.create('Ext.PagingToolbar', {
                                store: pageContentStore,
                                displayInfo: true,
                                displayMsg: 'Displaying {0} - {1} of {2}',
                                emptyMsg: i18n.getKey('noData')
                            })
                        }
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('isNeedInit PageContent'),
                        name: 'isNeedInitPageContent',
                        itemId: 'isNeedInitPageContent',
                        editable: false,
                        valueField: 'value',
                        displayField: 'display',
                        value: false,
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'display',
                                {
                                    name: 'value',
                                    type: 'boolean'
                                }
                            ],
                            data: [
                                {
                                    value: true,
                                    display: true,
                                }, {
                                    value: false,
                                    display: false,
                                }
                            ]
                        })
                    }
                ]
            }
        ];
        me.bbar = {
            hidden: me.readOnly,
            items: [
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_save',
                    handler: function (btn) {
                        var window = btn.ownerCt.ownerCt;
                        var createOrEdit = window.createOrEdit;
                        var form = window.getComponent('form');
                        if (form.isValid() == false) {
                            return;
                        }
                        var data = form.getValue();
                        var jsonData = null;
                        data.designId = window.designId;
                        jsonData = data;
                        var url = adminPath + 'api/sourceConfigController';
                        if (createOrEdit == 'edit') {
                            url = adminPath + 'api/sourceConfigController/' + window.record.getId();
                            jsonData._id = window.record.getId()
                        }
                        Ext.Ajax.request({
                            url: url,
                            method: createOrEdit == 'create' ? 'POST' : 'PUT',
                            jsonData: jsonData,
                            headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            },
                            success: function (response) {
                                var responseMessage = Ext.JSON.decode(response.responseText);
                                if (responseMessage.success) {
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                                        window.sourceconfigstore.load();
                                        window.close();
                                    });
                                } else {
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                }
                            },
                            failure: function (response) {
                                var responseMessage = Ext.JSON.decode(response.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                            }

                        })
                    }
                }, {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        win.close();
                    }
                }
            ]
        };
        me.callParent();
    },
    listeners: {
        afterrender: function () {
            var win = this;
            if (win.record) {
                var data = win.record.getData();
                var form = win.getComponent('form')
                var simplifyBomMaterialViewTypeId = form.getComponent('simplifyBomMaterialViewTypeId');
                var productMaterialViewTypeId = form.getComponent('productMaterialViewTypeId');
                var mvtType = form.getComponent('mvtType');
                var description = form.getComponent('description');
                var rtTypeId = form.getComponent('rtTypeId');
                var clazz = form.getComponent('clazz');
                var templateConfig = form.getComponent('productMaterialViewTypeTemplateConfigId');
                var pageContents = form.getComponent('pageContents');
                description.setValue(data['description']);
                clazz.setValue(data.clazz);
                if (data.clazz == 'com.qpp.cgp.domain.preprocess.config.PageContentSourceConfig') {
                    mvtType.setValue(data['mvtType']);
                    if (data.mvtType == 'productMaterialViewType') {
                        productMaterialViewTypeId.setValue([data.productMaterialViewType])
                    } else {
                        simplifyBomMaterialViewTypeId.setValue([data.simplifyMaterialViewType])
                    }
                } else if (data.clazz == 'com.qpp.cgp.domain.preprocess.config.PageContentTemplateSourceConfig') {
                    templateConfig.setInitialValue([data.productMaterialViewTypeTemplateConfigId]);
                } else if (data.clazz == 'com.qpp.cgp.domain.preprocess.config.RtObjectSourceConfig') {
                    rtTypeId.setInitialValue([data.rtTypeId]);
                } else if (data.clazz == 'com.qpp.cgp.domain.preprocess.config.StaticPageContentLibrarySourceConfig') {
                    pageContents.setValue(data['pageContents']);
                }
            }
        }
    },
})
