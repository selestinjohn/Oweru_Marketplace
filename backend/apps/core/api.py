from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class OptionalPaginationMixin:
    pagination_page_size = 20
    pagination_max_page_size = 100

    def list_response(
        self,
        queryset,
        *,
        serializer_class=None,
        context=None,
    ):
        queryset = self.filter_queryset(queryset)
        page = self._paginate_if_requested(queryset)
        serializer_class = serializer_class or self.get_serializer_class()
        context = context or self.get_serializer_context()

        if page is not None:
            serializer = serializer_class(
                page,
                many=True,
                context=context,
            )
            return self._optional_paginator.get_paginated_response(
                serializer.data
            )

        serializer = serializer_class(
            queryset,
            many=True,
            context=context,
        )

        return Response(
            serializer.data,
        )

    def _paginate_if_requested(
        self,
        queryset,
    ):
        query_params = self.request.query_params
        if (
            "page" not in query_params
            and "page_size" not in query_params
        ):
            return None

        paginator = PageNumberPagination()
        paginator.page_size = self.pagination_page_size
        paginator.page_size_query_param = "page_size"
        paginator.max_page_size = self.pagination_max_page_size
        self._optional_paginator = paginator

        return paginator.paginate_queryset(
            queryset,
            self.request,
            view=self,
        )
