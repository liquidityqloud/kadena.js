import {
  Event,
  useGetEventNodesQuery,
  useGetEventsByNameSubscription,
  useGetEventsQuery,
} from '@/__generated__/sdk';
import Loader from '@/components/common/loader/loader';
import { ErrorBox } from '@/components/error-box/error-box';
import { EventsTable } from '@/components/events-table/events-table';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import { getEventNodes, getEvents } from '@/graphql/queries.graph';
import { getEventsByName } from '@/graphql/subscriptions.graph';
import routes from '@constants/routes';
import {
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Grid,
  GridItem,
  Heading,
  Notification,
  Pagination,
  Select,
  Stack,
} from '@kadena/react-ui';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const Event: React.FC = () => {
  const router = useRouter();

  // Paginated events
  const getEventsQueryVariables = {
    qualifiedEventName: router.query.key as string,
    first: parseInt((router.query.items as string) || '10'),
  };

  const {
    loading: eventsQueryLoading,
    data: eventsQueryData,
    error: eventsQueryError,
    fetchMore,
  } = useGetEventsQuery({
    variables: getEventsQueryVariables,
    skip: !router.query.key,
  });

  // Polled events
  const getEventsByNameSubscriptionVariables = {
    qualifiedEventName: router.query.key as string,
  };

  const {
    loading: eventsSubscriptionLoading,
    data: eventsSubscriptionData,
    error: eventsSubscriptionError,
  } = useGetEventsByNameSubscription({
    variables: getEventsByNameSubscriptionVariables,
  });

  const nodesQueryVariables = {
    ids: eventsSubscriptionData?.events as string[],
  };

  const { data: nodesQueryData } = useGetEventNodesQuery({
    variables: nodesQueryVariables,
    skip: !eventsSubscriptionData?.events?.length,
  });

  const [subscriptionsEvents, setSubscriptionsEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (nodesQueryData?.nodes?.length) {
      const updatedEvents = [
        ...(nodesQueryData?.nodes as Event[]),
        ...subscriptionsEvents,
      ];

      if (updatedEvents.length > 20) {
        updatedEvents.length = 20;
      }

      setSubscriptionsEvents(updatedEvents);
    }
  }, [nodesQueryData]);

  // Pagination
  const itemsPerPageOptions = [10, 50, 100, 200];
  const urlPage = router.query.page;
  const urlItemsPerPage = router.query.items;

  const [itemsPerPage, setItemsPerPage] = useState<number>(
    urlItemsPerPage &&
      itemsPerPageOptions.includes(parseInt(urlItemsPerPage as string))
      ? parseInt(urlItemsPerPage as string)
      : 10,
  );

  const totalPages = Math.ceil(
    (eventsQueryData?.events.totalCount || 0) / itemsPerPage,
  );

  const [currentPage, setCurrentPage] = useState<number>(1);

  const refetchEvents = async () => {
    await fetchMore({
      variables: {
        first: itemsPerPage,
        last: null,
        after: null,
        before: null,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return fetchMoreResult;
      },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      await refetchEvents();
      setCurrentPage(1);
    };
    fetchData().catch((err) => {
      console.error(err);
    });
  }, [itemsPerPage]);

  // Set items per page and page in URL when they change
  useEffect(() => {
    const updateUrl = async () => {
      if (
        urlItemsPerPage !== itemsPerPage.toString() ||
        urlPage !== currentPage.toString()
      ) {
        const query = {
          ...router.query,
          page: currentPage,
          items: itemsPerPage,
        };

        await router.push({
          pathname: router.pathname,
          query,
        });
      }
    };
    updateUrl().catch((err) => {
      console.error(err);
    });
  }, [currentPage, itemsPerPage, router, urlItemsPerPage, urlPage]);

  const handlePaginationClick = async (newPageNumber: number) => {
    if (newPageNumber > currentPage) {
      await fetchMore({
        variables: {
          first: itemsPerPage,
          last: null,
          after: eventsQueryData?.events.pageInfo.endCursor,
          before: null,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return fetchMoreResult;
        },
      });
    } else if (newPageNumber < currentPage) {
      await fetchMore({
        variables: {
          first: null,
          last: itemsPerPage,
          after: null,
          before: eventsQueryData?.events.pageInfo.startCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          if (fetchMoreResult.events.edges.length < itemsPerPage) {
            return {
              ...prev,
              transactions: {
                ...fetchMoreResult.events,
                edges: [
                  ...fetchMoreResult.events.edges,
                  ...prev.events.edges,
                ].slice(0, itemsPerPage),
              },
            };
          }

          return fetchMoreResult;
        },
      });
    }

    setCurrentPage(newPageNumber);
  };

  return (
    <>
      <Stack justifyContent="space-between">
        <Breadcrumbs>
          <BreadcrumbsItem href={`${routes.HOME}`}>Home</BreadcrumbsItem>
          <BreadcrumbsItem>Events</BreadcrumbsItem>
        </Breadcrumbs>
        <GraphQLQueryDialog
          queries={[
            {
              query: getEvents,
              variables: getEventsQueryVariables,
            },
            {
              query: getEventsByName,
              variables: getEventsByNameSubscriptionVariables,
            },
            {
              query: getEventNodes,
              variables: nodesQueryVariables,
            },
          ]}
        />
      </Stack>

      <Box margin="md" />

      <Grid columns={2}>
        <GridItem>
          <Heading variant="h4">All events</Heading>
        </GridItem>
        <GridItem>
          <Heading variant="h4">Recent events</Heading>
        </GridItem>
      </Grid>

      <Grid columns={2}>
        <GridItem>
          <Stack justifyContent="space-between">
            <Select
              ariaLabel="items-per-page"
              id="items-per-page"
              onChange={(event) =>
                setItemsPerPage(parseInt(event.target.value))
              }
              style={{ display: 'inline-block' }}
              defaultValue={itemsPerPage}
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            <Pagination
              totalPages={totalPages}
              label="pagination"
              currentPage={currentPage}
              onPageChange={handlePaginationClick}
            />
          </Stack>
        </GridItem>
        <GridItem>
          <Box marginBlockStart="xxs" />
          <Stack alignItems="center" gap="xs">
            <Loader />
            <p>Polling for the latest events...</p>
          </Stack>
        </GridItem>
      </Grid>

      <Grid columns={2}>
        <GridItem>
          <LoaderAndError
            error={eventsQueryError}
            loading={eventsQueryLoading}
            loaderText="Waiting for events..."
          />

          {eventsQueryError && <ErrorBox error={eventsQueryError} />}

          {!eventsQueryLoading &&
            !eventsQueryError &&
            !eventsQueryData?.events?.edges.length && (
              <Notification intent="info" role="status">
                We could not find any transactions on this block.
              </Notification>
            )}

          {eventsQueryData?.events?.edges.length && (
            <EventsTable
              events={
                eventsQueryData?.events?.edges?.map((x) => x.node) as Event[]
              }
            />
          )}
        </GridItem>
        <GridItem>
          <LoaderAndError
            error={eventsSubscriptionError}
            loading={eventsSubscriptionLoading}
            loaderText="Waiting for events..."
          />

          {eventsSubscriptionError && (
            <ErrorBox error={eventsSubscriptionError} />
          )}

          <EventsTable events={subscriptionsEvents} />
        </GridItem>
      </Grid>
    </>
  );
};

export default Event;
