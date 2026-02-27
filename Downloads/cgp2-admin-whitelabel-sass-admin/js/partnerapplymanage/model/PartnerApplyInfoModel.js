/**
 * Created by nan on 2018/1/30.
 */
Ext.define('CGP.partnerapplymanage.model.PartnerApplyInfoModel', {
    extend: 'Ext.data.Model',
    idProperty:'_id',
    fields: [
        {
            name: '_id',
            type: 'string',
            useNull:true
        },
        {
            name: 'status',
            type: 'string'
        },
        {
            name:'partnerApplyInfo',
            type:'object'

        },
        {
            name:'websiteId',
            type:'int'
        },
        {
            name : 'createDate',
            type : 'date',
            convert: function (value) {
                return new Date(value)
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        },
        {
            name : 'updateDate',
            type : 'date',
            convert: function (value) {
                return new Date(value)
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        },
        {
            name:'remark',
            type:'string'
        },
        {
            name:'email',
            type:'string'
        },
        {
            name:'partnerApplyInfo',
            type:'object'
        },{
            name:'cooperationBusinesses',
            type:'object'
        }

    ],
    proxy:{
        url:adminPath+'',
        type:'uxrest',
        reader:{
            type:'json',
            root:'data.content'
        }
    }
})