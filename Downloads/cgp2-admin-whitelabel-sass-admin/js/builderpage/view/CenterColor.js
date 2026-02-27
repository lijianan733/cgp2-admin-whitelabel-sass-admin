/**
 * @author xiu
 * @date 2023/9/21
 */
Ext.Loader.syncRequire([
    'CGP.builderpage.view.SelectColor',
])
Ext.define('CGP.builderpage.view.CenterColor', {
    extend: 'Ext.form.Panel',
    alias: 'widget.centerColor',
    layout: {
        type: 'table',
        columns: 8,
        pack: 'center' // 设置 pack 属性为 'center'，表示横向居中对齐
    },
    minWidth: 350,
    margin: '10 0 0 10',
    parentComp: null,
    diyGetValue: function () {
        const me = this,
            items = me.items.items;
        var result = [];
        items.forEach(item => {
            const {isFilterComp} = item;

            if (!isFilterComp) {
                var value = item.diyGetValue();
                result = Ext.Array.merge(result, value);
            }
        })
        return result;
    },
    
    // 全选功能与其单选联动监听
    allSelectListeners: function () {
        var me = this,
            items = me.items.items,
            allSelectComp = me.getComponent('allSelect'),
            filteredItem = items.filter(item => {
                return !item['isFilterComp']
            }),
            selectedRecordsArr = filteredItem.map(item => {
                return item.getSelectedValue();
            }),
            isCheckAllTrue = selectedRecordsArr.every(item => item === true);

        allSelectComp['isEnabled'] = false;  //先关闭全选功能响应
        allSelectComp.setValue(isCheckAllTrue ? 'allSelect' : null); //赋值全选
        allSelectComp['isEnabled'] = true;   //开启全选功能响应
    },
    initComponent: function () {
        const me = this,
            {parentComp} = me;

        me.items = [
            {
                xtype: 'selectColor',
                boxLabel: '出血线',
                colspan: 2,
                layerTags: ['Builder-Bleeds', 'Production-Bleeds'],
                parentComp: parentComp,
            },
            {
                xtype: 'selectColor',
                boxLabel: '成品线',
                colspan: 2,
                layerTags: ['Finished', 'Builder-Cut', 'Production-Cut'],
                parentComp: parentComp,
            },
            {
                xtype: 'selectColor',
                boxLabel: '安全线',
                colspan: 2,
                layerTags: ['Safe'],
                parentComp: parentComp,
            },
            {
                xtype: 'selectColor',
                boxLabel: '折线',
                colspan: 2,
                layerTags: ['Builder-Folding', 'Composing-Folding', 'Production-Folding', 'Folding'],
                parentComp: parentComp,
            },
            {
                xtype: 'checkbox',
                checked: true,
                isFilterComp: true,  //标记为diyGetValue过滤组件
                boxLabel: i18n.getKey('全选'),
                colspan: 1,
                margin: '0 0 0 23',
                name: 'allSelect',
                itemId: 'allSelect',
                inputValue: 'allSelect',
                isEnabled: true, //用于区分点击和动态赋值的区别 打勾时是否启用其功能 (需要在动态赋值时不触发功能)
                listeners: {
                    change: function (comp, newValue) {
                        var container = comp.ownerCt,
                            items = container.items.items;

                        // 只有点击触发时 可触发对应事件
                        if (comp.isEnabled) {
                            items.forEach(item => {
                                var {isFilterComp} = item;

                                if (!isFilterComp) {
                                    newValue ? item.selectFun() : item.unselectFun();
                                }
                            })
                        }
                    }
                }
            },
            {
                xtype: 'button',
                isFilterComp: true,  //标记为diyGetValue过滤组件
                iconCls: 'icon_invert_selected',
                componentCls: "btnOnlyIcon",
                colspan: 1,
                itemId: 'invertAll',
                tooltip: '反选',
                handler: function (btn) {
                    var container = btn.ownerCt,
                        items = container.items.items;

                    items.forEach(item => {
                        var {isFilterComp} = item;

                        if (!isFilterComp) {
                            item.invertSelectedFun();
                        }
                    })
                }
            }
        ];
        me.callParent();
    }
})