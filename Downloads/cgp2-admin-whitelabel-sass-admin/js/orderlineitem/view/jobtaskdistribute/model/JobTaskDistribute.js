/**
 * Created by admin on 2020/8/12.
 */
Ext.define("CGP.orderlineitem.view.jobtaskdistribute.model.JobTaskDistribute", {
    extend: 'Ext.data.Model',
    //idProperty: '_id',
    /**
     * @cfg {Object[]} fields
     * field配置
     */
    fields: [
        {
            name: '_id',
            type: 'int',
            convert:function (v, record){
                return Ext.isEmpty(record.raw["jobTask"])?null:record.raw["jobTask"]['_id'];
            }
        },
        {
            name: 'singleJobConfigId',
            type: 'int',
            convert:function (v, record){
                return Ext.isEmpty(record.raw["jobTask"])?null:record.raw["jobTask"]['singleJobConfigId'];
            }
        },
        {
            name: 'pageGroup',
            type: 'object',
            convert:function (v, record){
                return Ext.isEmpty(record.raw["jobTask"])?null:record.raw["jobTask"]['pageGroup'];
            }
        },
        {
            name: 'jobBatchIds',
            type: 'array',
            convert:function (v, record){
                return Ext.isEmpty(record.raw["jobTask"])?null:record.raw["jobTask"]['jobBatchIds'];
            }
        },
        {
            name: 'jobType',
            type: 'string',
            convert:function (v, record){
                return Ext.isEmpty(record.raw["jobTask"])?null:record.raw["jobTask"]['jobType'];
            }
        },
        {
            name: 'impressions',
            type: 'array',
            convert:function (v, record){
                return Ext.isEmpty(record.raw["jobTask"])?null:record.raw["jobTask"]['impressions'];
            }
        },
        {
            name: 'documents',
            type: 'array',
            convert:function (v, record){
                return Ext.isEmpty(record.raw["jobTask"])?null:record.raw["jobTask"]['documents'];
            }
        },
        {
            name: 'status',
            type: 'string'
        },
        // {
        //     name: 'clazz',
        //     type: 'string',
        //     defaultValue:'com.qpp.job.domain.runtime.JobTaskDistribute'
        // },
        {
            name:'histories',
            type:'array'
        },
        {
            name:'paibanStatus',
            type:'number'
        }
    ]
});