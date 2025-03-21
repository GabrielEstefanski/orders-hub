interface SkeletonLoaderProps {
	type: 'kpi' | 'chart' | 'table';
}

const SkeletonLoader = ({ type }: SkeletonLoaderProps) => {
	if (type === 'kpi') {
		return (
			<div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md animate-pulse">
				<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4 mb-2"></div>
				<div className="h-8 bg-gray-300 dark:bg-gray-600 rounded-lg w-full"></div>
			</div>
		);
	}

	if (type === 'chart') {
		return (
			<div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md h-[500px] animate-pulse">
				<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3 mb-4"></div>
				<div className="h-96 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
			</div>
		);
	}

	if (type === 'table') {
		return (
			<div className="relative overflow-hidden rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
				<div className="absolute -right-6 -top-6 w-32 h-32 
					bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10
					dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5
					rounded-full blur-2xl opacity-50" 
				/>

				<div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg flex flex-col min-h-[600px]">
					<div className="sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm z-10 p-4 border-b border-gray-200/50 dark:border-gray-700/50">
						<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
							<div className="relative w-full max-w-lg">
								<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
									<i className="fa fa-search text-gray-500 dark:text-gray-400" aria-hidden="true" />
								</div>
								<div className="block w-full lg:w-80 sm:min-w-20 pl-10 pr-3 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
							</div>
							<div className="hidden sm:block w-40 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
						</div>
					</div>

					<div className="flex-grow overflow-auto">
						<table className="w-full text-sm">
							<thead className="sticky top-0 z-10 text-xs uppercase bg-gray-100/95 dark:bg-gray-700/95 backdrop-blur-sm border-y border-gray-200/50 dark:border-gray-700/50">
								<tr>
									{['Cliente', 'Produto', 'Status', 'Valor', 'Data de Criação', 'Ações'].map((_header, index) => (
										<th key={index} scope="col" className="px-6 py-4">
											<div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse w-3/4"></div>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{Array(7).fill(null).map((_, rowIndex) => (
									<tr key={rowIndex} className="bg-white dark:bg-gray-800 border-b border-gray-200/50 dark:border-gray-700/50">
										{Array(6).fill(null).map((_, colIndex) => (
											<td key={colIndex} className="px-6 py-4">
												<div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse w-full"></div>
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="sticky left-0 bottom-0 w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50">
						<div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
							<div className="h-4 w-48 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
							<div className="flex gap-2">
								{Array(3).fill(null).map((_, index) => (
									<div key={index} className="h-8 w-8 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return null;
};

export default SkeletonLoader