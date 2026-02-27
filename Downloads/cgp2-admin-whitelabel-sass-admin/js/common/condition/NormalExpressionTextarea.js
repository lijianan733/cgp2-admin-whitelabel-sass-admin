/**
 * @Description: 普通的表达式编辑文本框，直接使用表达式的字符串来set,get
 * @author nan
 * @date 2024/1/4
 */
Ext.define('CGP.common.condition.NormalExpressionTextarea', {
    extend: 'CGP.common.condition.view.ExpressionTextarea',
    alias: 'widget.normal_expression_textarea',
    width: '100%',
    height: 180,
    valueType: null,
    contextType: 'normal',
    toolbarCfg: {},
    contextStore: null,
    constructor: function (config) {
        var me = this;
        config.toolbarCfg = Ext.Object.merge({
            enableOverflow: true,
            //按钮统一为xxxBtn,然后统一加载到items里面
            editBtn: {
                xtype: 'button',
                text: '编辑表达式',
                itemId: 'edit',
                iconCls: 'icon_edit',
                handler: function (btn) {
                    var panel = btn.ownerCt.ownerCt;
                    var textarea = panel.down('textarea');
                    var str = textarea.getValue();
                    var contextStore = Ext.data.StoreManager.get('contentAttributeStore');
                    var win = Ext.create('CGP.common.condition.view.customexpression.CustomConditionWindow', {
                        animateTarget: btn.el,//动画的起点
                        initData: str,
                        contextType: 'profile',
                        profileStore: Ext.data.StoreManager.get('profileStore'),//属性映射里面的profile信息
                        contentAttributeStore: contextStore,
                        saveHandler: function (str) {
                            var me = this;
                            textarea.setValue(str);
                        }
                    });
                    win.show()
                }
            },
            items: []
        }, config.toolbarCfg);
        if (Ext.isEmpty(config.valueType)) {
            console.warn('没传valueType;会默认使用Boolean')
        }
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.toolbarCfg.items = me.toolbarCfg.items || [];
        for (var i in me.toolbarCfg) {
            if (/.+Btn$/.test(i)) {
                me.toolbarCfg.items.push(me.toolbarCfg[i]);
            }
        }
        me.callParent(arguments);

    },
    diySetValue: function (data) {
        var me = this;
        var expression = me.controller.splitFunctionBody(data);
        me.setValue(expression)
    },
    diyGetValue: function () {
        var me = this;
        var data = me.getValue();
        data = me.controller.buildCompleteFunction(data);
        return data;
    },
})
