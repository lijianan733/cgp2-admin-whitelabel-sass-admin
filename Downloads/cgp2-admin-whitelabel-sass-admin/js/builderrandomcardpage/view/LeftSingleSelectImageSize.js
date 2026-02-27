/**
 * @author xiu
 * @date 2023/9/21
 */
Ext.define('CGP.builderrandomcardpage.view.LeftSingleSelectImageSize', {
    extend: 'Ext.form.RadioGroup',
    alias: 'widget.LeftSingleSelectImageSize',
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
    resetSize: function () {
        const me = this;
        me.setValue({rbGroup: 'auto'});
    },
    diyGetValue: function () {
        const me = this,
            {rbGroup} = me.getValue();

        return rbGroup;
    },
    initComponent: function () {
        const me = this,
            {parentComp} = me;
        
        me.items = [
            {
                xtype: 'radiofield',
                boxLabel: '原图大小',
                name: 'rbGroup',
                inputValue: 'original'
            },
            {
                xtype: 'radiofield',
                boxLabel: '自适应大小',
                name: 'rbGroup',
                inputValue: 'auto'
            },
        ];
        me.listeners = {
            afterrender: function (comp) {
                comp.setValue({rbGroup: 'auto'});

                //跳过初始化的那次监听
                comp.on('change', function () {
                    parentComp.setImageQtyAndImageSize();
                })
            },
        }
        me.callParent();
    }
})