/**
 * @Description:
 * @author nan
 * @date 2025/3/20
 */
Ext.Loader.syncRequire([
    'CGP.cmsconfig.view.DiyHtmlEditor'
]);
Ext.onReady(function () {
    var store = Ext.create('CGP.cmsformcomponentrendertemplate.store.CmsFormComponentRenderTemplateStore');
    var page = Ext.widget({
        block: 'cmsformcomponentrendertemplate',
        xtype: 'uxeditpage',
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.cmsformcomponentrendertemplate.model.CmsFormComponentRenderTemplateModel',
            remoteCfg: false,
            layout: 'vbox',
            defaults: {
                allowBlank: false,
            },
            isValidForItems: true,
            useForEach: true,
            items: [
                {
                    xtype: 'textfield',
                    name: 'id',
                    itemId: 'id',
                    hidden: true,
                    fieldLabel: i18n.getKey('id'),
                },
                {
                    xtype: 'hiddenfield',
                    name: 'clazz',
                    itemId: 'clazz',
                    value: 'com.qpp.cgp.domain.cms.record.FormElementComponentTemplate'
                },
                {
                    xtype: 'textfield',
                    name: 'code',
                    itemId: 'code',
                    allowBlank: false,

                    fieldLabel: i18n.getKey('code'),
                },
                {
                    xtype: 'textfield',
                    name: 'description',
                    itemId: 'description',
                    allowBlank: false,

                    fieldLabel: i18n.getKey('description'),
                },
                {
                    xtype: 'combo',
                    name: 'isGroup',
                    itemId: 'isGroup',
                    editable: false,
                    allowBlank: false,
                    fieldLabel: i18n.getKey('类型'),
                    tipInfo: '表单属性渲染组件:表单界面上具体的输入组件,如checkbox,input等;<br>'
                        + 'group结构:表单界面上用于分组的html结构',
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
                    xtype: 'fileuploadv2',
                    name: 'previewImage',
                    fieldLabel: i18n.getKey('预览图'),
                    itemId: 'previewImage',
                    valueUrlType: 'part',
                    isUseParams: true,
                },
                {
                    // xtype: 'diy_html_editor',
                    xtype: 'expression_textarea',
                    width: 800,
                    minHeight: 250,
                    maxHeight: 450,
                    allowBlank: false,
                    name: 'template',
                    fieldLabel: '渲染模板',
                    itemId: 'template',
                    diySetValue: function (data) {
                        this.setValue(data);
                    },
                    diyGetValue: function () {
                        return this.getValue();
                    },
                    toolbarCfg: {
                        items: [
                            {
                                xtype: 'button',
                                text: i18n.getKey('预览'),
                                iconCls: 'x-form-search-trigger', //your iconCls here
                                handler: function (btn) {
                                    var uxtextarea_v2 = btn.ownerCt.ownerCt.ownerCt;
                                    var comment = JSUbbToHtml(uxtextarea_v2.getValue());
                                    var win = Ext.create('Ext.window.Window', {
                                        title: '预览',
                                        modal: true,
                                        html: `<iframe width="600" height="400" frameborder="0" srcdoc="${comment}"></iframe>`,
                                    });
                                    win.show();
                                },
                                scope: this,
                                tooltip: i18n.getKey('预览'),
                                overflowText: i18n.getKey('预览')
                            },
                        ]
                    }

                },
            ]
        },

    });

});
