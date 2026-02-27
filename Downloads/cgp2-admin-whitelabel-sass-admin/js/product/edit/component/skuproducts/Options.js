Ext.define('CGP.product.edit.component.skuproducts.Options', {
    extend: 'Ext.form.Panel',
    header: {
        style: 'background-color:white;',
        color: 'black',
        border: false
    },
    defaults: {
        msgTarget: 'side'
    },
        bodyStyle: 'border-color:silver;padding:10px',

    optionTypesStore: Ext.empty,
    constructor: function (config) {

        var me = this;




        config = config || {};

        me.callParent([config]);

    },
    initComponent: function () {
        var me = this;

        me.title = '<font color=green>' + i18n.getKey('selectOptions') + '</font>';
        me.width = "100%";
        var existTypes = me.existTypes;
        var skuAttributeIds = me.skuAttributeIds;
        var optionTypes = me.optionTypes;
        var attributes = me.attributes;
        var optionTypesStore = optionTypes.getStore();
        var tm = new Ext.util.TextMetrics(), maxLabelWidth = 0;

        var itemIds = [];
        //create option form field
        var fields = [];
        Ext.Array.each(skuAttributeIds, function (skuAttributeId) {
            var attribute = attributes.getById(skuAttributeId);


            var field = createCheckBoxByOptions(attribute);

            itemIds.push(attribute.get('code'));
            if(!Ext.isEmpty(field.items)){
                fields.push(field);
            }

        });

        function createCheckBoxByOptions(attribute) {
            var items = [];
            var checkedOptionId = me.getSkuAttributeDefaultValue(attribute.get('id'));
            Ext.Array.each(attribute.get('options'), function (option) {
                var item = {
                    name: attribute.get('code'),
                    boxLabel: option.name,
                    inputValue: option.id
                }
                if (option.id == checkedOptionId) {
                    item.checked = true;
                }
                //?查是否被?中

                items.push(item);
            })
            var field = {
                xtype: 'checkboxgroup',
                fieldLabel: attribute.get('name'),
                columns: 3,
                vertical: true,
                //allowBlank: false,
                itemId: attribute.get('code'),
                items: items
            }

            var labelWidth = tm.getWidth(field.fieldLabel + ':');
            if (labelWidth > maxLabelWidth) {
                maxLabelWidth = labelWidth;
            }

            return field;
        };
        me.fieldDefaults = {
            labelWidth: maxLabelWidth
        }
        me.items= fields;
        me.callParent(arguments);

        me.addDocked({
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    handler: function () {
                        var form = this.ownerCt.ownerCt;
                        //每个skuAttribute对应一个options数组
                        var allOptions = [];
                        Ext.Array.each(itemIds, function (itemId) {
                            var options = [];
                            var field = form.getComponent(itemId);
                            if(field){
                                Ext.Array.each(field.getValue()[itemId], function (value) {
                                    options.push(eval('({"' + itemId + '":"' + value + '"})'));
                                });
                                allOptions.push(options);
                            }
                        });
                        //获得数组的排列组合的数组
                        var allTypes = me.permutationArray(allOptions);

                        //删除指定的对象从对象数组中
                        me.removeExistFromArray(allTypes, existTypes);

                        //在加入之前 先赋sku salePrice weight的默认值
                        var salePrice = me.data['salePrice'];
                        var weight = me.data['weight'];
                        var sku = me.data['model'];
                        var skuIndex = me.skuProductStore.getCount();
                        for (var i = 0; i < allTypes.length; i++) {
                            allTypes[i] = Ext.merge(allTypes[i], {
                                sku: sku + '_' + (++skuIndex),
                                weight: weight,
                                salePrice: salePrice
                            });
                        }

                        optionTypesStore.loadData(allTypes);
                        optionTypes.setVisible(true);

                    }
                }
            ]
        });
    },
    permutationArray: function (a) {
        //每个数组的长度 顺序为在中的顺序
        var lengths = [];
        //所有排列的种类
        var allTypes = [];

        var divisors = [];

        var typeCount;

        //初始化lengths, allTypes, divisors
        function initParams() {
            typeCount = 1;
            for (var i = 0; i < a.length; i++) {
                lengths.push(a[i].length);
                typeCount = typeCount * a[i].length;
            }

            for (i = 0; i < lengths.length; i++) {
                var divisor = 1;
                for (var j = i + 1; j < lengths.length; j++) {
                    divisor = divisor * lengths[j];
                    console.log(j);
                }
                divisors.push(divisor);
            }

        }

        function getPermutation() {
            for (var i = 0; i < typeCount; i++) {
                var type = {};
                for (var j = 0; j < a.length; j++) {
                    type = Ext.merge(type, a[j][Math.floor((i % (a[j].length * divisors[j])) / divisors[j])]);
                }
                allTypes.push(type);
            }
        }

        initParams();
        getPermutation();
        return allTypes;

    },
    removeExistFromArray: function (allTypes, existTypes) {
        var removeTypes = [];
        Ext.Array.each(existTypes, function (existType) {
            Ext.Array.each(allTypes, function (type) {
                var equal = false;
                Ext.Object.each(existType, function (p) {
                    //如果是本对象具有的属性
                    if (this.hasOwnProperty(p)) {
                        if (this[p] == type[p]) {
                            equal = true;
                        } else {
                            equal = false;
                            return false;
                        }
                    }
                });
                if (equal) {
                    removeTypes.push(type);
                }
            })

        })


        Ext.Array.each(removeTypes, function (removeType) {
            Ext.Array.remove(allTypes, removeType);
        })
    },
    getSkuAttributeDefaultValue: function (id) {
        var me= this;
        var value;
        Ext.Array.each(me.data.attributeValues, function (av) {
            if (av.attributeId == id) {
                value = av.optionIds;
                return false;
            }
        })
        return value;
    }

})