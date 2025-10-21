import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { AccountEntryDialog } from '@/components/forms/account-entry-dialog';

export default async function AccountsPage() {
  const accounts = await prisma.account.findMany({
    include: {
      category: true,
    },
    orderBy: { date: 'desc' },
  });

  const categories = await prisma.accountCategory.findMany();

  const totalIncome = accounts.filter(a => a.type === 'INCOME').reduce((sum, a) => sum + a.amount, 0);
  const totalExpense = accounts.filter(a => a.type === 'EXPENSE').reduce((sum, a) => sum + a.amount, 0);
  const netBalance = totalIncome - totalExpense;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Accounts</h1>
          <p className="text-gray-600">Track income and expenses</p>
        </div>
        <AccountEntryDialog categories={categories} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Income</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Net Balance</p>
            <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netBalance)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <p className="text-gray-600">No transactions recorded yet.</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Reference</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {accounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{formatDate(account.date)}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge className={account.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {account.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{account.category.name}</td>
                    <td className="px-4 py-3 text-sm">{account.description || '-'}</td>
                    <td className="px-4 py-3 text-sm">{account.reference || '-'}</td>
                    <td className={`px-4 py-3 text-sm text-right font-semibold ${account.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                      {account.type === 'INCOME' ? '+' : '-'}{formatCurrency(account.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}