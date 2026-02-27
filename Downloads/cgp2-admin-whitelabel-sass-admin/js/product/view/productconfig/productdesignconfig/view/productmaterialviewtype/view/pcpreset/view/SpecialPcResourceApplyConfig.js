/**
 * Created by nan on 2021/10/13
 * 随机预设特例化的组件
 */
Ext.Loader.syncRequire([
    'CGP.pcresourcelibrary.view.ResourceGridCombo',
    'CGP.businesstype.store.BusinessTypeStore',
    'CGP.pcresourcelibrary.store.PCResourceItemStore',
    'CGP.virtualcontainertype.store.VirtualContainerObjectStore'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpreset.view.SpecialPcResourceApplyConfig', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.specialpcresourceapplyconfig',
    defaults: {
        width: 450
    },
    labelStyle: "display:none",
    pcsData: null,
    initComponent: function () {
        var me = this;
        var businessTypeStore = Ext.create('CGP.businesstype.store.BusinessTypeStore');
        var containerObjectStore = Ext.create('CGP.virtualcontainertype.store.VirtualContainerObjectStore', {
            autoLoad: false,
        })
        me.items = [
            {
                xtype: 'jsonpathselector',
                itemId: 'targetSelector',
                name: 'targetSelector',
                fieldLabel: i18n.getKey('目标位置'),
                rawData: me.pcsData
            },
            {
                name: 'businessLib',
                xtype: 'gridcombo',
                fieldLabel: i18n.getKey('businessType'),
                itemId: 'businessLib',
                editable: false,
                allowBlank: false,
                valueField: '_id',
                displayField: 'diyDisplay',
                matchFieldWidth: false,
                store: businessTypeStore,
                gridCfg: {
                    width: 650,
                    height: 350,
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            dataIndex: '_id',
                            itemId: 'id',
                        },
                        {
                            text: i18n.getKey('name'),
                            dataIndex: 'name',
                            width: 200,
                            itemId: 'name',
                        },
                        {
                            text: i18n.getKey('resources') + i18n.getKey('type'),
                            dataIndex: 'type',
                            itemId: 'type',
                            flex: 1,
                            renderer: function (value) {
                                return value.split('.').pop();
                            }
                        }
                    ],
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: businessTypeStore,
                    }
                },
                tipInfo: '业务类型会和指定的资源类型关联,使用对应资源类型的资源来进行随机填充',
                diySetValue: function (data) {
                    if (data) {
                        this.setInitialValue([data._id]);
                    }
                },
                diyGetValue: function (data) {
                    return this.getArrayValue();
                },
            },
            {
                xtype: 'gridcombo',
                name: 'intent',
                fieldLabel: i18n.getKey('intent'),
                itemId: 'intent',
                allowBlank: false,
                displayField: 'diyDisplay',
                valueField: '_id',
                editable: false,
                haveReset: true,
                store: Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.store.ResourceApplyIntentStore'),
                matchFieldWidth: false,
                valueType: 'idReference',
                tipInfo: '规定了资源在目标选择器选出来的元素上是替换还是添加<br>',
                gridCfg: {
                    height: 350,
                    width: 500,
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            dataIndex: '_id'
                        },
                        {
                            text: i18n.getKey('name'),
                            flex: 1,
                            dataIndex: 'name',
                            renderer: function (value, metadata) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('code'),
                            flex: 1,
                            dataIndex: 'code',
                            renderer: function (value, metadata) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        }, {
                            text: i18n.getKey('targetType'),
                            flex: 1,
                            dataIndex: 'targetType',
                            renderer: function (value, metadata) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        }
                    ],
                },
                diySetValue: function (data) {
                    if (data) {
                        this.setInitialValue([data._id]);
                    }
                },
                diyGetValue: function (data) {
                    return this.getArrayValue();
                },
            },
            {
                xtype: 'combo',
                name: 'convertConfig',
                fieldLabel: i18n.getKey('convertConfig'),
                itemId: 'convertConfig',
                allowBlank: true,
                editable: false,
                hidden: true,
                valueField: 'value',
                displayField: 'display',
                haveReset: true,
                store: {
                    xtype: 'store',
                    fields: [
                        'value', 'display'
                    ],
                    data: [
                        {
                            value: 'com.qpp.cgp.domain.theme.ImageConvertConfig',
                            display: 'ImageConvertConfig'
                        },
                        {
                            value: 'com.qpp.cgp.domain.theme.TextConvertConfig',
                            display: 'TextConvertConfig'
                        }
                    ]
                },
                diyGetValue: function () {
                    var clazz = this.getValue();
                    if (clazz) {
                        return {
                            clazz: this.getValue()
                        }
                    }
                },
                diySetValue: function (data) {
                    if (data) {
                        this.setValue(data.clazz);
                    }
                }
            },
            {
                xtype: 'textfield',
                name: 'clazz',
                itemId: 'clazz',
                hidden: true,
                fieldLabel: i18n.getKey('clazz'),
                value: 'com.qpp.cgp.domain.theme.PcResourceApplyConfig'
            }
        ];
        me.callParent(arguments);
    }
})