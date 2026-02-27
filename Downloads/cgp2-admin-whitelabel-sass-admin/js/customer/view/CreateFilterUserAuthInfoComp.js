/**
 * @Description:
 * @author xiu
 * @date 2025/9/28
 */
Ext.define('CGP.customer.view.CreateFilterUserAuthInfoComp', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.user_auth_info',
    autoScroll: true,
    isFilterComp: true,
    layout: 'hbox',
    itemId: 'orderAndSeqNo',
    defaults: {
        isFilterComp: true,
        margin: '0 0 0 5',
    },
    width: 370,
    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'combo',
                name: 'userAuthInfos.authType',
                itemId: 'userAuthInfos.authType',
                fieldLabel: i18n.getKey('用户登录方式'),
                width: 200,
                emptyText: '类型',
                isLike: false,
                editable: false,
                haveReset: true,
                isFilterComp: false,
                labelWidth: 90,
                store: new Ext.data.Store({
                    fields: ['name', 'value'],
                    //陈宝石没对清类图 故authType的 邮箱字段为 password 谷歌字段为 google
                    data: [
                        {
                            name: '谷歌',
                            value: 'google'
                        },
                        {
                            name: '手机号',
                            value: 'phone'
                        },
                        {
                            name: '邮箱',
                            value: 'password'
                        },
                        {
                            name: '微信',
                            value: 'wechat'
                        },
                    ]
                }),
                displayField: 'name',
                valueField: 'value',
                listeners: {
                    change: function (comp, newValue) {
                        var form = comp.ownerCt,
                            value = form.getComponent('value'),
                            //陈宝石没对清类图 故authType的 邮箱字段为 password 谷歌字段为 google 需要做valueName转换
                            valueNameGather = {
                                google: 'gmail',
                                phone: 'phone',
                                password: 'email',
                                wechat: 'nickName',
                            },
                            valueName = valueNameGather[newValue];

                        value.setDisabled(!newValue);
                        !newValue && value.reset();
                        
                        // 设置值组件的name
                        value.name = `userAuthInfos.${valueName}`;
                    }
                }
            },
            {
                xtype: 'displayfield',
                width: 8,
                value: '-'
            },
            {
                xtype: 'textfield',
                name: 'value',
                itemId: 'value',
                hideTrigger: true,
                isFilterComp: false,
                disabled: true,
                isLike: false,
                emptyText: '值',
                width: 200,
            },
        ]

        me.callParent();
    }
})