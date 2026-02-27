/**
 * @Description:使用在uxTextarea工具条上,取expressionTemplate来直接使用
 * @author nan
 * @date 2023/2/16
 */
Ext.Loader.syncRequire([
    'CGP.tools.expressiontemplate.view.ExpressionTemplateGrid'
])
Ext.define('CGP.common.condition.view.UseTemplateBtn', {
    extend: 'Ext.button.Button',
    alias: 'widget.usetemplatebtn',
    text: '使用模板',
    iconCls: 'icon_export',
    targetTextarea: null,//特殊指定
    getTextareaFun: null,
    saveHandler: null,
    handler: function (btn) {
        var uxtextarea = btn.targetTextarea || btn.ownerCt.ownerCt;
        var textarea = uxtextarea.getComponent('textarea') || uxtextarea.items.items[1];
        if (btn.getTextareaFun) {
            textarea = btn.getTextareaFun();
        }
        var usetemplatebtn = btn;
        var win = Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            width: 950,
            height: 700,
            title: '选择一表达式模板',
            items: [{
                xtype: 'expressiontemplategrid',
                itemId: 'templateGrid',
                filterCfg: {
                    header: false,
                },
                tbarCfg: {
                    btnCreate: {
                        disabled: false,
                    },
                    btnDelete: {
                        disabled: true,
                    }
                },
                gridCfg: {
                    deleteAction: false,
                    editAction: true,
                    selModel: {
                        selType: 'checkboxmodel',
                        multiselect: false,
                        checkOnly: false,
                        mode: "single",//multi,simple,single；默认为多选multi
                        allowDeselect: true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
                    },
                }
            }],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    text: '使用模板',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var gridContainer = win.getComponent('templateGrid');
                        var selection = gridContainer.grid.getSelectionModel().getSelection();
                        if (selection.length > 0) {
                            if (usetemplatebtn.saveHandler) {
                                var expression = selection[0].getData().expression;
                                usetemplatebtn.saveHandler(expression,win);
                            } else {
                                var expression = selection[0].getData().expression;
                                textarea.setValue(textarea.getValue() + expression);
                                win.close();
                            }
                        } else {
                            Ext.Msg.alert(i18n.getKey('prompt'), '请选择一条模板配置');
                        }
                    }
                }
            }
        });
        win.show();
    }
})