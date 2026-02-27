/**
 * Created by nan on 2021/6/30
 * 多语言选择组件
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productviewconfig.view.navigationV3.store.ResourceStore'
]);
Ext.define('CGP.common.field.MultiLanguageField', {
        extend: 'Ext.form.field.GridComboBox',
        alias: 'widget.multilanguagefield',
        allowBlank: false,
        displayField: 'name',
        valueField: 'name',
        autoScroll: true,
        editable: false,
        matchFieldWidth: false,
        multiSelect: false,
        autoQuery: false,
        haveReset: true,
        diyGetValue: function () {
            var me = this;
            var data = me.getArrayValue();
            if (data) {
                return data.name;
            } else {
                return null;
            }
        },
        diySetValue: function (data) {
            var me = this;
            me.setValue({
                name: data
            })
        },
        initComponent: function () {
            var me = this;
            me.store = Ext.create('CGP.product.view.productconfig.productviewconfig.view.navigationV3.store.ResourceStore', {
                storeId: 'resourceStore',
                autoLoad: false,
            });
            me.gridCfg = Ext.Object.merge({
                height: 400,
                width: 600,
                columns: [
                    {
                        dataIndex: 'name',
                        flex: 1,
                        text: i18n.getKey('name'),
                        renderer: function (value, mateData, record) {
                            return value;
                        }
                    },
                    {
                        dataIndex: 'values',
                        flex: 1,
                        xtype: 'arraycolumn',
                        text: i18n.getKey('value'),
                        renderer: function (value, mateData, record) {
                            var data = JSUbbToHtml(value.value);
                            mateData.tdAttr = 'data-qtip="' + data + '"';
                            return value.code + ':' + data;
                        }
                    }
                ],
                bbar: {
                    xtype: "pagingtoolbar",
                    store: me.store
                }
            }, me.gridCfg);
            me.filterCfg = Ext.Object.merge({
                minHeight: 60,
                createHandler: function () {
                    JSOpen({
                        id: 'multilanguageconfig_edit',
                        url: path + 'partials/multilanguageconfig/add.html',
                        title: i18n.getKey('create') + '_' + i18n.getKey('resources'),
                        refresh: true
                    })
                },
                layout: {
                    type: 'column',
                    columns: 2
                },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'name',
                        itemId: 'name',
                        fieldLabel: i18n.getKey('name')
                    },
                    {
                        xtype: 'hiddenfield',
                        name: 'type',
                        itemId: 'type',
                        value: 'BuilderConfig',
                        isLike: false,
                        fieldLabel: i18n.getKey('type')
                    }
                ]
            }, me.filterCfg);
            me.callParent();
        }
    }
)