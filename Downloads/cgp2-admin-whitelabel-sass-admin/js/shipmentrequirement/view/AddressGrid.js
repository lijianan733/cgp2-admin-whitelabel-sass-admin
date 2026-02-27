Ext.define("CGP.shipmentrequirement.view.AddressGrid", {
    extend: 'CGP.common.commoncomp.QueryGrid',
    width: 920,
    height: 400,
    /**
     * @cfg {Object} filterDate
     * 实现过滤已存在的合作用户
     */
    filterDate: null,
    /**
     * @cfg {Ext.util.MixedCollection} collection
     * 記錄所有選中的產品ID集合，实现翻页记录
     */
    collection: new Ext.util.MixedCollection(),
    constructor: function (config) {
        var me = this;
        me.callParent(arguments);

    },
    initComponent: function () {
        Ext.apply(Ext.form.field.VTypes, {
            phone: function (v) {
                return /^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/.test(v);
            },
            phoneText: '请输入有效的电话号码'
        });
        var me = this;
        var user = Ext.JSON.decode(Ext.util.Cookies.get('user'));
        var userId = user.userId;
        me.store = Ext.create("CGP.customer.store.AddressBookStore", {
            autoLoad: true,
            userId: userId
        });
        me.gridCfg = {
            store: me.store,
            editAction: false,
            setModel: {
                mode: 'SINGLE'
            },
            selType: 'rowmodel',
            deleteAction: false,
            columns: [
                {

                    itemId: 'firstName',
                    header: i18n.getKey('lastName') + i18n.getKey('firstName'),
                    renderer: function (value, metar, record) {
                        return record.get("lastName") + record.get("firstName");
                    }
                },
                {
                    dataIndex: 'address',
                    itemId: 'address',
                    width: 350,
                    header: i18n.getKey('address'),
                    renderer: function (value, metar, record) {
                        var record = record;
                        var gender;
                        var addressStr = '';
                        if (record.get('gender') != null) {
                            var str = record.get("gender");
                            if (str == 'M') {
                                gender = i18n.getKey('male');
                            } else if (str == 'F') {
                                gender = i18n.getKey('female');
                            }
                        }
                        var name = record.get('firstName') + record.get('lastName') + " ";
                        if (!Ext.isEmpty(gender)) {
                            name = name + gender + " ";
                        }
                        var emailAddress,
                            countryName;
                        if (!Ext.isEmpty(record.get("emailAddress"))) {
                            name = name + record.get("emailAddress") + "  ";
                        }
                        if (!Ext.isEmpty(record.get("countryName"))) {
                            name = name + record.get("countryName") + "  ";
                        }
                        addressStr = name + record.get('state') + " " + record.get("city") + " " + record.get("suburb");

                        if (!Ext.isEmpty(record.get("streetAddress1"))) {
                            addressStr = addressStr + "<br>" + record.get("streetAddress1");
                        }
                        if (!Ext.isEmpty(record.get("streetAddress2"))) {
                            addressStr = addressStr + "<br>" + record.get("streetAddress2");
                        }
                        metar.tdAttr = 'data-qtip="' + addressStr + '"';
                        return addressStr;
                    }
                },
                {
                    dataIndex: 'telephone',
                    itemId: 'telephone',
                    width: 150,
                    header: i18n.getKey('telephone')
                },
                {
                    dataIndex: 'emailAddress',
                    itemId: 'emailAddress',
                    minWidth: 150,
                    flex: 1,
                    header: i18n.getKey('emailAddress')
                }
            ]
        };
        me.filterCfg = {
            height: 90,
            header: false,
            defaults: {
                width: 280
            },
            items: [
                {
                    name: 'firstName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('firstName'),
                    itemId: 'firstName'
                }, {
                    id: 'telephone',
                    name: 'telephone',
                    xtype: 'textfield',
                    fieldLabel: 'telephone',
                    vtype: 'phone',
                    itemId: 'telephone'
                },
                {
                    name: 'lastName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('lastName'),
                    itemId: 'lastName'
                },
                {
                    name: 'emailAddress',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('email'),
                    itemId: 'emailAddress'
                }
            ]
        };
        me.callParent(arguments);
    }
});
