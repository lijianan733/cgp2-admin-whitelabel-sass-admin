/**
 * @author xiu
 * @date 2023/9/21
 */
Ext.define('CGP.builderpage.view.SelectColor', {
    extend: 'Ext.form.Panel',
    alias: 'widget.selectColor',
    layout: {
        type: 'vbox',
        pack: 'center' // 设置 pack 属性为 'center'，表示横向居中对齐
    },
    minWidth: 120,
    border: false,
    boxLabel: null,
    parentComp: null,
    // 选中方法
    selectFun: function () {
        var me = this,
            showBleedPattern = me.getComponent('showBleedPattern');

        showBleedPattern.setValue('showBleedPattern');
    },
    // 取消选中方法
    unselectFun: function () {
        var me = this,
            showBleedPattern = me.getComponent('showBleedPattern');

        showBleedPattern.setValue(null);
    },
    // 反选方法
    invertSelectedFun: function () {
        var me = this,
            showBleedPattern = me.getComponent('showBleedPattern'),
            showBleedPatternValue = showBleedPattern.getValue();

        showBleedPatternValue ? me.unselectFun() : me.selectFun();
    },
    diyGetValue: function () {
        const me = this,
            result = [],
            items = me.items.items;
        items.forEach(item => {
            const value = item.diyGetValue();
            value && result.push(item.diyGetValue());
        })
        return result;
    },
    getSelectedValue: function () {
        var me = this,
            showBleedPattern = me.getComponent('showBleedPattern');

        return showBleedPattern.getValue();
    },
    initComponent: function () {
        const me = this,
            {parentComp} = me,
            evenType = 'update',
            controller = Ext.create('CGP.builderpage.controller.Controller');

        me.items = [
            {
                xtype: 'checkbox',
                boxLabel: me.boxLabel,
                layerTags: me.layerTags,
                name: 'showBleedPattern',
                itemId: 'showBleedPattern',
                inputValue: 'showBleedPattern',
                checked: true,
                margin: '0 0 0 23',
                diyGetValue: function () {
                    const me = this,
                        value = me.getValue();
                    return controller.centerLineFun(me.layerTags, value);
                },
                listeners: {
                    change: function (comp, newValue, oldValue) {
                        var nameArray = [],
                            form = comp.ownerCt,
                            formOwnerCt = form.ownerCt,
                            radiogroup = form.getComponent('radiogroup'),
                            isColorSelect = !Ext.Object.isEmpty(radiogroup.diyGetValue());

                        // 样式
                        // radiogroup.reset();
                        radiogroup.setDisabled(!newValue);

                        nameArray.push(form.layerTags);
                        // isColorSelect && nameArray.push(JSON.stringify(form.layerTags) + 'Color');

                        // 取值
                        // 发送请求
                        parentComp.loadPage(evenType, {
                            nameArray: nameArray
                        });

                        // 控制全选功能
                        formOwnerCt.allSelectListeners();
                    }
                },
            },
            {
                xtype: 'radiogroup',
                itemId: 'radiogroup',
                componentCls: "btnOnlyIcon",
                iconCls: 'icon_refresh',
                layerTags: me.layerTags,
                width: 80,
                margin: '0 0 0 20',
                diyGetValue: function () {
                    const me = this,
                        value = me.getValue(),
                        {rbGroup} = value;
                    return rbGroup ? controller.centerColorFun(me.layerTags, rbGroup) : null;
                },
                defaults: {
                    baseCls: 'custom-radio',
                    listeners: {
                        change: function (field, newValue, oldValue) {
                            var customRadio = field.el.dom.getElementsByTagName('input')[0];
                            if (newValue) {
                                customRadio.classList.add('x-form-cb-chxselect');
                            } else {
                                customRadio.classList.remove('x-form-cb-chxselect');
                            }
                        }
                    },
                },
                items: [
                    {
                        xtype: 'radiofield',
                        name: 'rbGroup',
                        inputValue: '16711680',
                        baseCls: 'custom-radio custom-red',
                    },
                    {
                        xtype: 'radiofield',
                        name: 'rbGroup',
                        inputValue: '255',
                        baseCls: 'custom-radio custom-blue',
                    },
                    {
                        xtype: 'radiofield',
                        name: 'rbGroup',
                        inputValue: '0',
                        baseCls: 'custom-radio custom-black',
                    },
                    {
                        xtype: 'radiofield',
                        name: 'rbGroup',
                        inputValue: '32768',
                        baseCls: 'custom-radio custom-green',
                    }
                ],
                previousValue: null,
                listeners: {
                    change: function (comp, newValue, oldValue) {
                        const me = comp.ownerCt;
                        // 存在选择时发送请求
                        !Ext.Object.isEmpty(newValue) && parentComp.loadPage(evenType, {
                            nameArray: [JSON.stringify(me.layerTags) + 'Color']
                        });

                        if (newValue === comp.previousValue) {
                            comp.setValue(null);
                            comp.previousValue = null;
                        } else {
                            comp.previousValue = newValue;
                        }
                    }
                },
            },
        ];

        me.callParent();
    }
})