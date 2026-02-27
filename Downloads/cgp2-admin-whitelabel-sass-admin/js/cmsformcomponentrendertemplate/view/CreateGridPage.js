/**
 * @Description:
 * @author nan
 * @date 2025/3/20
 */
Ext.Loader.syncRequire([
    'CGP.cmsconfig.view.DiyHtmlEditor'
]);
Ext.define('CGP.cmsformcomponentrendertemplate.view.CreateGridPage', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.createGridPage',
    store: null,
    block: 'cmsformcomponentrendertemplate',
    editPage: 'edit.html',
    i18nblock: i18n.getKey('属性表单组件渲染模板'),
    initComponent: function () {
        var me = this;
        me.store = Ext.create('CGP.cmsformcomponentrendertemplate.store.CmsFormComponentRenderTemplateStore');
        me.config = {
            block: me.block,
            tbarCfg: {
                hiddenButtons: ['config', 'help', 'export', 'import'],
            },
            gridCfg: {
                store: me.store,
                columnDefaults: {
                    align: 'center'
                },
                columns: [
                    {
                        text: i18n.getKey('id'),
                        width: 160,
                        dataIndex: '_id',
                    },
                    {
                        text: i18n.getKey('code'),
                        width: 250,
                        dataIndex: 'code',
                    },
                    {
                        text: i18n.getKey('description'),
                        dataIndex: 'description',
                        width: 250,

                    },
                    {
                        xtype: 'atagcolumn',
                        text: i18n.getKey('template'),
                        dataIndex: 'template',
                        getDisplayName: function () {
                            return `<a class="atag_display">查看</a>`;
                        },
                        clickHandler: function (value) {
                            var win = Ext.create('Ext.window.Window', {
                                layout: 'fit',
                                title: '模板',
                                constrain: true,
                                modal: true,
                                width: 600,
                                height: 500,
                                items: [{
                                    xtype: 'diy_html_editor',
                                    name: 'template',
                                    itemId: 'template',
                                }]
                            });
                            win.show(null, function () {
                                win.getComponent('template').diySetValue(value);
                            });
                        }
                    },
                    {
                        text: i18n.getKey('类型'),
                        dataIndex: 'isGroup',
                        width: 160,
                        renderer: function (value, metaData, record) {
                            var statusGather = {
                                    false: {
                                        color: 'red',
                                        text: '表单属性渲染组件'
                                    },
                                    true: {
                                        color: 'green',
                                        text: 'group结构'
                                    },
                                },
                                {color, text} = statusGather[value];
                            return JSCreateFont(color, true, text)
                        }
                    },

                    {
                        text: i18n.getKey('预览图'),
                        dataIndex: 'previewImage',
                        xtype: 'imagecolumn',
                        width: 120,
                        flex: 1,
                        buildUrl: function (value) {
                            var image = value;
                            var imgSize = '/100/100/png?' + Math.random();
                            return (imageServer + image + imgSize);
                        },
                        buildPreUrl: function (value) {
                            var image = value;
                            return (imageServer + image);
                        },
                        buildTitle: function (value, metadata, record) {
                            return `${i18n.getKey('check')} < ${record.get('name')} >预览图`;
                        },
                    },
                ]
            },
            filterCfg: {
                items: [
                    {
                        xtype: 'numberfield',
                        name: 'id',
                        itemId: 'id',
                        hideTrigger: true,
                        isLike: false,
                        fieldLabel: i18n.getKey('id'),
                    },
                    {
                        xtype: 'textfield',
                        name: 'code',
                        itemId: 'code',
                        hideTrigger: true,
                        isLike: false,
                        fieldLabel: i18n.getKey('code'),
                    },
                    {
                        xtype: 'combo',
                        name: 'isGroup',
                        itemId: 'isGroup',
                        editable: false,
                        allowBlank: true,
                        fieldLabel: i18n.getKey('类型'),
                        store: Ext.create('Ext.data.Store', {
                            fields: ['key', 'value'],
                            data: [
                                {
                                    key: true,
                                    value: 'group结构'
                                },
                                {
                                    key: false,
                                    value: '表单属性渲染组件'
                                }
                            ]
                        }),
                        displayField: 'value',
                        valueField: 'key',
                    },
                    {
                        xtype: 'textfield',
                        name: 'description',
                        itemId: 'description',
                        hideTrigger: true,
                        isLike: true,
                        fieldLabel: i18n.getKey('description'),
                    },
                ]
            }
        }
        me.callParent();
    },
})