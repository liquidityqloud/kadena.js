import DrawerToolbar from '@/components/Common/DrawerToolbar';
import { FormItemCard } from '@/components/Global/FormItemCard';
import { ProgressBar } from '@/components/Global/ProgressBar';
import RequestKeyField, {
  REQUEST_KEY_VALIDATION,
} from '@/components/Global/RequestKeyField';
import { menuData } from '@/constants/side-menu-items';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useToolbar } from '@/context/layout-context';
import { useDidUpdateEffect } from '@/hooks';
import type { IStatusData } from '@/services/transfer-tracker/get-transfer-status';
import {
  StatusId,
  getTransferStatus,
} from '@/services/transfer-tracker/get-transfer-status';
import { validateRequestKey } from '@/services/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FormFieldStatus } from '@kadena/react-ui';
import {
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  Grid,
  GridItem,
  Link,
  Notification,
  NotificationButton,
  NotificationFooter,
  NotificationHeading,
  Stack,
  SystemIcon,
  TrackerCard,
} from '@kadena/react-ui';
import Debug from 'debug';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, FC } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  formButtonStyle,
  headerTextStyle,
  infoBoxStyle,
  mainContentStyle,
} from './styles.css';

const schema = z.object({
  requestKey: REQUEST_KEY_VALIDATION,
});

type FormData = z.infer<typeof schema>;

const CrossChainTransferTracker: FC = () => {
  const { selectedNetwork: network, networksData } = useWalletConnectClient();
  const router = useRouter();
  const { t } = useTranslation('common');

  useToolbar(menuData, router.pathname);

  const debug = Debug(
    'kadena-transfer:pages:transfer:cross-chain-transfer-tracker',
  );

  const [requestKey, setRequestKey] = useState<string>(
    (router.query?.reqKey as string) || '',
  );
  const [data, setData] = useState<IStatusData>({});
  const [txError, setTxError] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');
  const [validRequestKey, setValidRequestKey] = useState<
    FormFieldStatus | undefined
  >();
  const drawerPanelRef = useRef<HTMLElement | null>(null);

  useDidUpdateEffect(() => {
    if (!router.isReady) {
      return;
    }
    const { reqKey } = router.query;
    if (reqKey) {
      setRequestKey(reqKey as string);
    }
  }, [router.isReady]);

  useEffect(() => {
    setData({});
  }, [network]);

  const checkRequestKey = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    debug(checkRequestKey.name);

    //Clear error message when user starts typing
    setInputError('');
    if (!requestKey) {
      setValidRequestKey(undefined);
      return;
    }

    if (validateRequestKey(requestKey) === undefined) {
      setValidRequestKey('negative');
      return;
    }
    setValidRequestKey(undefined);
    return;
  };

  const handleSubmit = async (data: FormData): Promise<void> => {
    debug(handleSubmit);

    router.query.reqKey = data.requestKey;
    await router.push(router);

    setTxError('');

    try {
      await getTransferStatus({
        requestKey: data.requestKey,
        network: network,
        t,
        options: {
          onPoll: (status: IStatusData) => {
            setData(status);
            if (status.status === 'Error' && status.description) {
              //Set error message
              setTxError(status.description);
            }
          },
        },
        networksData,
      });
    } catch (error) {
      debug(error);
    }
  };

  const {
    register,
    handleSubmit: validateThenSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: { requestKey: router.query.reqKey as string },
    // @see https://www.react-hook-form.com/faqs/#Howtoinitializeformvalues
    resetOptions: {
      keepDirtyValues: true, // keep dirty fields unchanged, but update defaultValues
    },
  });

  const onRequestKeyChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      setRequestKey(e.target.value);
    },
    [],
  );

  useEffect(() => {
    if (errors.requestKey?.message) {
      setInputError(errors.requestKey.message);
      setTxError('');
    }
  }, [errors.requestKey?.message]);

  return (
    <div className={mainContentStyle}>
      <Stack
        flexDirection="column"
        paddingBlockStart={'xs'}
        paddingBlockEnd={'xxxl'}
        gap={'lg'}
      >
        <Stack flexDirection="column" gap={'xs'}>
          <Breadcrumbs>
            <BreadcrumbsItem>{t('Transfer')}</BreadcrumbsItem>
            <BreadcrumbsItem>{t('Cross Chain Tracker')}</BreadcrumbsItem>
          </Breadcrumbs>
          <Stack
            gap={'lg'}
            justifyContent={'space-between'}
            alignItems={'flex-end'}
          >
            <div className={headerTextStyle}>
              {t('Track & trace transactions')}
            </div>
            {data.id === StatusId.Pending ? (
              <Link
                title={t('Finish Transaction')}
                href={`/transactions/cross-chain-transfer-finisher?reqKey=${requestKey}`}
                endIcon={<SystemIcon.Link />}
                color="positive"
              >
                {t('Finish Transaction')}
              </Link>
            ) : null}
          </Stack>
        </Stack>

        {txError ? (
          <Notification
            intent="negative"
            isDismissable
            onDismiss={() => {
              setTxError('');
            }}
            icon={<SystemIcon.AlertBox />}
            role="status"
          >
            <NotificationHeading>Warning</NotificationHeading>
            {txError}
            <NotificationFooter>
              <NotificationButton
                intent="negative"
                onClick={validateThenSubmit(handleSubmit)}
                icon={<SystemIcon.Refresh />}
              >
                {t('Retry')}
              </NotificationButton>
            </NotificationFooter>
          </Notification>
        ) : null}
        <form onSubmit={validateThenSubmit(handleSubmit)}>
          <FormItemCard
            heading={t('Search Request')}
            helper={t('Where can I find the request key?')}
            helperHref="#"
            disabled={false}
          >
            <Grid>
              <GridItem>
                <RequestKeyField
                  helperText={inputError || undefined}
                  status={validRequestKey}
                  {...register('requestKey')}
                  onKeyUp={checkRequestKey}
                  onChange={onRequestKeyChange}
                  error={errors.requestKey}
                />
              </GridItem>
            </Grid>
          </FormItemCard>
          <div className={formButtonStyle}>
            <Button
              type="submit"
              title={t('Search')}
              endIcon={<SystemIcon.Magnify />}
            >
              {t('Search')}
            </Button>
          </div>
        </form>

        {data.receiverAccount ? (
          <DrawerToolbar
            ref={drawerPanelRef}
            initialOpenItem={0}
            sections={[
              {
                icon: 'Information',
                title: t('Transfer Information'),
                children: (
                  <div className={infoBoxStyle}>
                    <TrackerCard
                      variant="vertical"
                      icon={'QuickStart'}
                      labelValues={[
                        {
                          label: t('Sender'),
                          value: data.senderAccount || '',
                          isAccount: true,
                        },
                        {
                          label: t('Chain'),
                          value: data.senderChain || '',
                        },
                      ]}
                    />
                    {/*  Progress Bar will only show if the transfer is in progress /
                    completed.  If an error occurs, the notification will display the
                    error and no progress bar will show */}
                    <ProgressBar
                      checkpoints={[
                        {
                          status: 'complete',
                          title: t('Initiated transaction'),
                        },
                        {
                          status:
                            data?.id === StatusId.Success
                              ? 'complete'
                              : 'pending',
                          title: data.description || 'An error has occurred',
                        },
                        {
                          status:
                            data.id === StatusId.Pending
                              ? 'incomplete'
                              : 'complete',
                          title: t('Transfer complete'),
                        },
                      ]}
                    />
                    <TrackerCard
                      variant="vertical"
                      icon={
                        data?.id === StatusId.Success
                          ? 'Receiver'
                          : 'ReceiverInactive'
                      }
                      labelValues={[
                        {
                          label: t('Receiver'),
                          value: data.receiverAccount || '',
                          isAccount: true,
                        },
                        {
                          label: t('Chain'),
                          value: data.receiverChain || '',
                        },
                      ]}
                    />
                  </div>
                ),
              },
            ]}
          />
        ) : null}
      </Stack>
    </div>
  );
};

export default CrossChainTransferTracker;
