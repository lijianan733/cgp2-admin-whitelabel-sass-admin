/**
 * @Description:
 * @author nan
 * @date 2024/8/8
 */
Ext.define('CGP.cmsconfig.view.DiyHtmlEditor', {
    extend: 'CGP.common.condition.view.ExpressionTextarea',
    alias: 'widget.diy_html_editor',
    minHeight: 150,
    extraBtn: null,
    initComponent: function () {
        var me = this;

        me.toolbarCfg = {
            items: Ext.Array.merge([
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
                {
                    xtype: 'button',
                    text: i18n.getKey('校验'),
                    iconCls: 'icon_test', //your iconCls here
                    handler: function (btn) {
                        var uxtextarea_v2 = btn.ownerCt.ownerCt.ownerCt;
                        let validHTML = uxtextarea_v2.getValue();

                        function validateHTML(htmlString) {
                            let tempElement = document.createElement('div');
                            tempElement.innerHTML = htmlString.trim();

                            // 检查临时元素是否解析成功
                            return tempElement.innerHTML.toLowerCase() === htmlString.trim().toLowerCase();
                        }

                        var isValid = validateHTML(validHTML);
                        if (isValid) {
                            Ext.Msg.alert('提示', '校验通过');
                        } else {
                            Ext.Msg.alert('提示', '非法的html代码,请自行检查');
                        }
                    }
                }
            ], me.extraBtn || [])
        }
        me.callParent(arguments);
    },
    diySetValue: function (data) {
        this.setValue(data);
    },
    diyGetValue: function () {
        return this.getValue();
    },
    getErrors: function () {
        return '语法错误';
    },
    isValid: function () {
        var me = this;
        var isValid = me.callParent(arguments);
        var errors = me.textarea?.codeMirror?.state.lint.marked;
        if (errors && errors.length > 0) {
            isValid = false;
            console.log(errors?.length);
        }
        return isValid;
    },
    textareaCfg: {
        codeMirrorConfig: {
            mode: "text/html",
            lineNumbers: true,
            alignCDATA: true,
            lineWrapping: true,//是否自动换行
            matchBrackets: true, // 括号匹配
            smartIndent: true, // 自动缩进，设置是否根据上下文自动缩进（和上一行相同的缩进量）。默认为true
            gutters: ["CodeMirror-lint-markers"],
            lint: true,
        }
    },
})