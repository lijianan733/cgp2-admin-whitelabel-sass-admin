/**
 * @author xiu
 * @date 2023/10/16
 */
Ext.define('CGP.tools.createPathFile.view.createLayerParam', {
    extend: 'Ext.container.Container',
    alias: 'widget.createLayerParam',
    title: i18n.getKey('生成File'),
    layout: 'vbox',
    autoScroll: true,
    isFormField: true,
    initComponent: function () {
        const me = this;
        me.items = [
            {
                xtype: 'splitbar',
                itemId: 'splitbar',
                width: '100%',
                items: [
                    {
                        xtype: 'displayfield',
                        value: JSCreateFont('green', true, me.title) + JSCreateFont('red', true, ' *')
                    },
                    {
                        xtype: 'button',
                        itemId: 'addBtn',
                        iconCls: 'icon_add',
                        text: i18n.getKey('添加'),
                        margin: '2 10 0 10',
                        menu: [],
                    },
                    {
                        xtype: 'button',
                        itemId: 'clearBtn',
                        iconCls: 'icon_clear',
                        text: i18n.getKey('清空'),
                        margin: '2 0 0 0',
                        handler: function (btn) {
                            const panel = btn.ownerCt.ownerCt,
                                container = panel.getComponent('container');

                            Ext.Msg.confirm('提示','确定删除？', function (selector) {
                                if (selector === "yes") {
                                    container.removeAll();
                                }
                            })
                        }
                    },
                ]
            },
            {
                xtype: 'container',
                itemId: 'container',
                width: '100%',
                autoScroll: true,
                layout: {
                    type: 'table',
                    columns: 2
                },
                defaults: {
                    margin: '5 25 5 0',
                },
                items: [],
                listeners: {
                    remove: function (comp, item) {
                        var {itemId} = item,
                            container = comp.ownerCt,
                            splitbar = container.getComponent('splitbar'),
                            addBtn = splitbar.getComponent('addBtn'),
                            items = addBtn.menu.items.items,
                            menuBtn = addBtn.menu.getComponent(itemId);

                        menuBtn?.setVisible(true);
                        var allHidden = items.every(function (btn) {
                            return btn.hidden === true;
                        });

                        addBtn?.setDisabled(allHidden);
                    },
                    add: function (comp, item) {
                        var {itemId} = item,
                            container = comp.ownerCt,
                            splitbar = container.getComponent('splitbar'),
                            addBtn = splitbar.getComponent('addBtn'),
                            items = addBtn.menu.items.items,
                            menuBtn = addBtn.menu.getComponent(itemId);

                        menuBtn?.setVisible(false);
                        var allHidden = items.every(function (btn) {
                            return btn.hidden === true;
                        });

                        addBtn?.setDisabled(allHidden);
                    }
                },
                diyGetValue: function () {
                    const me = this,
                        items = me.items.items,
                        result = [];

                    items.forEach(item => result.push(item.diyGetValue()));
                    return result;
                }
            }
        ];
        me.callParent();
    },
    clearInfo: function () {
        const me = this,
            splitbar = me.getComponent('splitbar'),
            container = me.getComponent('container'),
            addBtn = splitbar.getComponent('addBtn');

        addBtn.menu.removeAll();
        container.removeAll();
    },
    diySetValue: function (data) {
        const me = this,
            {layerSettings} = data,
            container = me.getComponent('container'),
            splitbar = me.getComponent('splitbar'),
            addBtn = splitbar.getComponent('addBtn');

        // 渲染
        layerSettings.forEach(item => {
            const {layer, componentProperties} = item,
                childrenItems = [];

            // 中层container
            componentProperties.forEach(childItem => {
                const {component, properties} = childItem,
                    fieldItems = [];

                // 内层field
                for (let fieldItem in properties) {
                    fieldItems.push(
                        {
                            xtype: 'textfield',
                            width: 300,
                            name: fieldItem,
                            fieldLabel: fieldItem,
                            labelWidth: 120,
                            value: properties[fieldItem]
                        }
                    )
                }

                childrenItems.push(
                    {
                        xtype: 'container',
                        width: '100%',
                        layout: 'hbox',
                        diyGetValue: function () {
                            const me = this,
                                result = {},
                                items = me.items.items;

                            items.forEach(item => {
                                const {name} = item;
                                result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
                            })

                            return result;
                        },
                        items: [
                            {
                                xtype: 'displayfield',
                                flex: 1,
                                name: 'component',
                                displayValue: component,
                                diyGetValue: function () {
                                    const me = this;
                                    return me.displayValue;
                                },
                                value: JSCreateFont('green', true, component, 15)
                            },
                            {
                                xtype: 'container',
                                flex: 3,
                                layout: 'vbox',
                                name: 'properties',
                                diyGetValue: function () {
                                    const me = this,
                                        items = me.items.items,
                                        result = {};

                                    items.forEach(item => {
                                        const {name} = item;
                                        result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
                                    })

                                    return result;
                                },
                                items: fieldItems
                            }
                        ]
                    }
                )
            })

            // 外层fieldset
            const result = {
                xtype: 'uxfieldset',
                name: layer,
                itemId: layer,
                width: 600,
                minHeight: 180,
                title: '<font color="green">' + layer + '</font>',
                layout: 'vbox',
                defaults: {
                    padding: '10 10 10 25',
                    labelWidth: 60,
                },
                legendItemConfig: {
                    deleteBtn: {
                        hidden: false,
                        disabled: false,
                        isUsable: false,//初始化时，是否是禁用
                        handler: function (btn) {
                            Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                                if (selector == 'yes') {
                                    //触发修改事件
                                    var me = btn.ownerCt.ownerCt,
                                        container = me.ownerCt;
                                    container.remove(me);
                                }
                            })
                        }
                    }
                },
                items: childrenItems,
                diyGetValue: function () {
                    const me = this,
                        items = me.items.items,
                        result = [];

                    items.forEach(item => result.push(item.diyGetValue()));

                    return {
                        layer: layer,
                        componentProperties: result
                    };
                }
            }

            // 渲染按钮
            addBtn.menu.add(
                {
                    text: layer,
                    itemId: layer,
                    disabledCls: 'menu-item-display-none',
                    handler: function () {
                        container.add(result);
                    }
                },
            )

            // 渲染组件
            container.add(result)
        })
    },
    diyGetValue: function () {
        var me = this,
            container = me.getComponent('container');

        return container.diyGetValue();
    },
    validate: function () {
        const me = this;
        return me.isValid();
    },
    getFieldLabel: function () {
        const me = this;
        return me.title;
    },
    getErrors: function () {
        return '不允许为空';
    },
    isValid: function () {
        const me = this,
            splitbar = me.getComponent('splitbar'),
            container = me.getComponent('container'),
            items = container.items.items,
            isValid = !!items.length;

        splitbar.el.setStyle('border-color', isValid ? 'silver' : '#c13127')
        return isValid;
    }
})