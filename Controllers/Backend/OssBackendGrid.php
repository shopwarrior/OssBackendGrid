<?php
use Shopware\Components\Model\QueryBuilder;
use Doctrine\DBAL\Connection;

class Shopware_Controllers_Backend_OssBackendGrid extends Shopware_Controllers_Backend_ExtJs
{
    public function getOrdersAction()
    {
        $filters = [];
        $userId = $this->Request()->getParam('customerId', null);
        if( $this->Request()->getParam('fromDate', null) )
            $filters['fromDate'] =[
                'property'  =>  'fromDate',
                'value'  =>  date('Y-m-d',strtotime($this->Request()->getParam('fromDate'))),
            ];
        if( $this->Request()->getParam('toDate', null) )
            $filters['toDate'] =[
                'property'  =>  'toDate',
                'value'  =>  date('Y-m-d',strtotime($this->Request()->getParam('toDate'))),
            ];
        if (!$userId) {
            $this->View()->success = false;
            return;
        }
        $where = '';
        foreach($filters as $filter) {
            switch ($filter['property']) {
                case 'fromDate';
                    $where .= ' AND ordertime > :fromDate';
                    $properties['fromDate'] = $filter['value'];
                    break;
                case 'toDate';
                    $where .= ' AND ordertime < :toDate';
                    $properties['toDate'] = $filter['value'];
                    break;
            }
        }

        $query = 'SELECT SQL_CALC_FOUND_ROWS 
                id as orderId,
                ordernumber as number,
                SUM(invoice_amount) amount,
                SUM(invoice_amount_net) amountNet
                
                FROM `s_order`
                
                WHERE userID=? AND ordernumber!=0
                GROUP BY id ASC';

        $data = Shopware()->Db()->fetchAll($query, [$userId]);

        $this->View()->assign(array(
            'success' => true,
            'data' => $data,
            'total' => Shopware()->Db()->fetchOne("SELECT FOUND_ROWS()")
        ));
    }

    public function listAction()
    {
        //read store parameter to filter and paginate the data.
        $limit = $this->Request()->getParam('limit', 40);
        $offset = $this->Request()->getParam('start', 0);
        $sort = $this->Request()->getParam('sort', null);
        $filter = $this->Request()->getParam('filter', null);

        $list = $this->getOrdersList($filter, $sort, $offset, $limit);
        $this->View()->assign($list);
    }

    /**
     * The getList function returns an array of the configured class model.
     * The listing query created in the getListQuery function.
     * The pagination of the listing is handled inside this function.
     *
     * @param $filters
     * @param $sort
     * @param $offset
     * @param $limit
     * @return array
     */
    protected function getOrdersList($filters, $sort, $offset, $limit)
    {
        $properties = [];
        $where = '';

        foreach($filters as $filter){
            if(!empty($filter['value'])) {
                switch ($filter['property']) {
                    case 'search';
                        $where .= ' AND (u.customernumber like :customernumber OR o.ordernumber like :ordernumber 
                        OR bil.company like :company )';
                        $properties['customernumber'] = $filter['value'] . '%';
                        $properties['ordernumber'] = $filter['value'] . '%';
                        $properties['company'] = $filter['value'] . '%';
                        break;
                    case 'customerGroup';
                        $where .= ' AND u.customergroup = :customerGroup';
                        $properties['customerGroup'] = $filter['value'];
                        break;
                    case 'fromDate';
                        $where .= ' AND o.ordertime >= :fromDate';
                        $properties['fromDate'] = $filter['value'];
                        break;
                    case 'toDate';
                        $where .= ' AND o.ordertime <= :toDate';
                        $properties['toDate'] = $filter['value'];
                        break;
                }
            }
        }

        $sortOrder = $this->normalizeSort($sort);
        $query = 'SELECT SQL_CALC_FOUND_ROWS 
                o.id,
                o.id as orderId,
                u.id as customerId,
                u.customergroup as `group`,
                CONCAT(bil.firstname, " ", bil.lastname, " (", bil.company, ")") as customerBilling,
                u.customernumber as customerNumber,
                count(o.id) as total,
                SUM(o.invoice_amount_net) amountNet
                
                FROM `s_order` as o
                LEFT JOIN `s_user` as u ON (o.userID=u.id)
                LEFT JOIN `s_user_attributes` as ua ON (ua.userID=u.id)                
                LEFT JOIN `s_order_billingaddress` as bil ON o.`id`=bil.orderID
                
                WHERE o.ordernumber!=0 '.$where.' 
                GROUP BY o.userID
                ORDER BY ' . $sortOrder . '
                LIMIT ' . $offset . ',' . $limit;

        if(empty($properties))
            $data = Shopware()->Db()->fetchAll($query);
        else
            $data = Shopware()->Db()->fetchAll($query, $properties);

        return array(
            'success' => true,
            'data' => $data,
            'total' => Shopware()->Db()->fetchOne("SELECT FOUND_ROWS()")
        );
    }

    /**
     * @param $sort
     * @return string
     */
    private function normalizeSort($sort){
        switch($sort[0]['property']){
            case 'orderId':
                $field = 'o.id';
                break;
            case 'number':
                $field = 'o.ordernumber';
                break;
            case 'total':
                $field = 'count(o.id)';
                break;
            case 'customerBilling':
                $field = 'bil.company';
                break;
            case 'customerNumber':
                $field = 'u.customernumber';
                break;
            case 'amountNet':
                $field = 'o.invoice_amount_net';
                break;
            default:
                $field = 'o.ordertime';
        }

        switch($sort[0]['direction']){
            case 'ASC':
                $order = 'asc';
                break;
            default:
                $order = 'desc';
        }

        return $field.' '.$order.', o.userID';
    }
}
