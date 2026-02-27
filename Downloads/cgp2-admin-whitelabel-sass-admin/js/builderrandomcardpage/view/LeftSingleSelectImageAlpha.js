/**
 * @author xiu
 * @date 2023/9/21
 */
Ext.define('CGP.builderrandomcardpage.view.LeftSingleSelectImageAlpha', {
    extend: 'Ext.form.RadioGroup',
    alias: 'widget.LeftSingleSelectImageAlpha',
    layout: {
        type: 'hbox',
        pack: 'left' // 设置 pack 属性为 'center'，表示横向居中对齐
    },
    minWidth: 300,
    border: false,
    margin: '10 0 0 40',
    defaults: {
        margin: '0 20 0 0',
    },
    parentComp: null,
    diyGetValue: function () {
        const me = this,
            {rbGroup} = me.getValue(),
            controller = Ext.create('CGP.builderrandomcardpage.controller.Controller'),
            transparentGather = {
                fullyTransparent: 0,
                halfTransparent: 0.5,
                notTransparent: 1,
            },
            result = controller.leftSingleSelectFun(transparentGather[rbGroup]);

        return result;
    },
    initComponent: function () {
        const me = this,
            {parentComp} = me,
            evenType = 'update',
            controller = Ext.create('CGP.builderrandomcardpage.controller.Controller')
        ;
        me.items = [
            {
                xtype: 'radiofield',
                boxLabel: '不透明底图',
                name: 'rbGroup',
                inputValue: 'notTransparent'
            },
            {
                xtype: 'radiofield',
                boxLabel: '半透明底图',
                name: 'rbGroup',
                inputValue: 'halfTransparent'
            },
            {
                xtype: 'radiofield',
                boxLabel: '透明底图',
                name: 'rbGroup',
                inputValue: 'fullyTransparent'
            },
        ];
        me.listeners = {
            afterrender: function (comp) {
                comp.setValue({rbGroup: 'halfTransparent'});
                //跳过初始化的那次监听
                comp.on('change', function () {
                    parentComp.loadPage(evenType, {
                        nameArray: ['alpha']
                    });
                })
            },
        }
        me.callParent();
    }
})