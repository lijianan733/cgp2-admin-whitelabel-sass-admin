/**
 * @author nan
 * @date 2026/1/26
 * @description TODO
 */
Ext.define('CGP.partner_credit.model.PartnerCreditModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'int',
            useNull: true
        },
        //应付款
        {
            name: 'receivableNum',
            type: 'number'
        },
        //地址
        {
            name: 'address',
            type: 'string'
        },
        //审批时间
        {
            name: 'auditDate',
            type: 'string',
        },
        //审批备注
        {
            name: 'auditRemark',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: "com.qpp.cgp.domain.partner.credit.PartnerCreditConfig"
        },
        //信贷配置创建时间
        {
            name: 'configCreatedDate',
            type: 'number'
        },
        {
            name: 'createdBy',
            type: 'string',
            useNull: true,
        },
        {
            name: 'createdDate',
            type: 'string',
            useNull: true,
        },
        //币种
        {
            name: 'currencyCode',
            type: 'string'
        },
        //客户简称

        {
            name: 'customerAbbreviation',
            type: 'string'
        },
        //英文名称
        {
            name: 'customerEnName',
            type: 'string'
        },
        //邮箱
        {
            name: 'email',
            type: 'string'
        },
        //宽限期
        {
            name: 'gracePeriodDays',
            type: 'string'
        },
        {
            name: 'idReference',
            type: 'number'
        },
        /*     partner信贷保险配置 {
                 creditDetail (string, optional), 信贷明细
                 creditSummary (string, optional), 信贷摘要
                 paymentMethod (string, optional) 付款方式
             }*/
        {
            name: 'insuranceConfig',
            type: 'object'
        },
        {
            name: 'modifiedBy',
            type: 'string',
            useNull: true,
        },
        {
            name: 'modifiedDate',
            type: 'string',
            useNull: true,
        },
        {
            name: 'partner',
            type: 'object'
        }, {
            name: 'partnerIdRef',
            type: 'string'
        },
        //付款期
        {
            name: 'paymentTermDays',
            type: 'number'
        },
        //相关凭证
        {
            name: 'reviewDocs',
            type: 'array'
        },

        //风险信贷额
        {
            name: 'riskCreditLimit',
            type: 'number'
        },
        //管理信贷额
        {
            name: 'creditLimit',
            type: 'number'
        },
        //['Pending', 'Valid', 'Invalid', 'Remove'],
        {
            name: 'status',
            type: 'string'
        }, {
            name: 'telephone',
            type: 'object'
        }, {
            name: 'version',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + `api/partner/credit`,
        reader: {
            type: 'json',
            root: 'data'
        }
    },
});
